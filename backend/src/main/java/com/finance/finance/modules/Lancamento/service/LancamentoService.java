package com.finance.finance.modules.Lancamento.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.Lancamento.dto.LancamentoCsvRow;
import com.finance.finance.modules.Lancamento.dto.LancamentoParceladoRequestDto;
import com.finance.finance.modules.Lancamento.dto.LancamentoRequestDto;
import com.finance.finance.modules.Lancamento.dto.LancamentoResponseDTO;
import com.finance.finance.modules.Lancamento.dto.LancamentoResumoDTO;
import com.finance.finance.modules.Lancamento.dto.LancamentoStatusResponseDTO;
import com.finance.finance.modules.Lancamento.mapper.LancamentoMapper;
import com.finance.finance.modules.Lancamento.model.Lancamento;
import com.finance.finance.modules.Lancamento.repository.LancamentoRepository;
import com.finance.finance.modules.Lancamento.repository.LancamentoResumoProjection;
import com.finance.finance.modules.Lancamento.utils.MapperText;
import com.finance.finance.modules.categoria.model.Categoria;
import com.finance.finance.modules.categoria.repository.CategoriaRepository;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.common.dto.BulkErroDTO;
import com.finance.finance.modules.common.dto.BulkResponseDTO;
import com.finance.finance.modules.common.enums.PagamentoEnum;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.enums.TipoLancamento;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.modules.conta.model.Conta;
import com.finance.finance.modules.conta.repository.ContaRepository;
import com.finance.finance.modules.fornecedor.model.Fornecedor;
import com.finance.finance.modules.fornecedor.repository.FornecedorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LancamentoService {

    private final LancamentoRepository lancamentoRepository;
    private final ContaRepository contaRepository;
    private final CategoriaRepository categoriaRepository;
    private final ClienteRepository clienteRepository;
    private final FornecedorRepository fornecedorRepository;

    @Transactional
    public LancamentoResponseDTO criar(LancamentoRequestDto dto) {
        Conta conta = buscarContaAtiva(dto.getContaId());
        Categoria categoria = buscarCategoria(dto.getCategoriaId());
        Cliente cliente = dto.getClienteId() != null ? buscarCliente(dto.getClienteId()) : null;
        Fornecedor fornecedor = dto.getFornecedorId() != null ? buscarFornecedor(dto.getFornecedorId()) : null;

        if (dto.getDataLancamento() == null) {
            dto.setDataLancamento(LocalDateTime.now());
        }
        validarDatas(dto.getDataLancamento(), dto.getDataVencimento());

        Lancamento salvo = lancamentoRepository
                .save(LancamentoMapper.toEntity(dto, conta, categoria, cliente, fornecedor));
        return LancamentoMapper.toDto(salvo);
    }

    @Transactional
    public BulkResponseDTO<LancamentoResponseDTO> criarBulk(MultipartFile file) {
        validarFicheiro(file);

        List<String> linhas = lerLinhasCSV(file);

        if (linhas.isEmpty()) {
            throw new BusinessException("O ficheiro CSV nao contem lancamentos");
        }

        List<LancamentoCsvRow> rows = new ArrayList<>();
        List<BulkErroDTO> erros = new ArrayList<>();

        // Parsing das linhas — erros de formato são reportados pela posição.
        for (int i = 0; i < linhas.size(); i++) {
            int pos = i + 1;
            try {
                rows.add(parseLinha(linhas.get(i)));
            } catch (IllegalArgumentException | DateTimeParseException e) {
                rows.add(null); // mantém o alinhamento posição ↔ linha
                erros.add(new BulkErroDTO(pos, "(linha " + pos + ")", e.getMessage()));
            }
        }

        return processarRows(rows, erros);
    }

    @Transactional
    public BulkResponseDTO<LancamentoResponseDTO> criarBulkJson(List<LancamentoCsvRow> rows) {
        if (rows == null || rows.isEmpty()) {
            throw new BusinessException("A lista de lancamentos esta vazia");
        }
        return processarRows(new ArrayList<>(rows), new ArrayList<>());
    }

    /**
     * Valida e constrói os lançamentos de cada linha, gravando os válidos e
     * reportando os inválidos em {@code erros}, alinhados pela posição (1-based).
     * Entradas {@code null} (linhas com erro de parsing) são ignoradas aqui.
     */
    private BulkResponseDTO<LancamentoResponseDTO> processarRows(
            List<LancamentoCsvRow> rows, List<BulkErroDTO> erros) {

        List<Lancamento> paraGravar = new ArrayList<>();

        for (int i = 0; i < rows.size(); i++) {
            LancamentoCsvRow row = rows.get(i);
            if (row == null) {
                continue; // já reportado no parsing
            }

            int pos = i + 1;
            String identificador = (row.descricao() != null && !row.descricao().isBlank())
                    ? row.descricao()
                    : "(linha " + pos + ")";

            try {
                paraGravar.addAll(montarLancamentos(row));
            } catch (ResourceNotFoundException | BusinessException | IllegalArgumentException
                    | IllegalStateException | DateTimeParseException e) {
                erros.add(new BulkErroDTO(pos, identificador, e.getMessage()));
            }
        }

        List<LancamentoResponseDTO> criados = paraGravar.isEmpty()
                ? List.of()
                : lancamentoRepository.saveAll(paraGravar).stream()
                        .map(LancamentoMapper::toDto)
                        .toList();

        return new BulkResponseDTO<>(criados, erros);
    }

    /** Constrói os lançamentos de uma linha (expande parcelas se aplicável). */
    private List<Lancamento> montarLancamentos(LancamentoCsvRow row) {
        if (row.valor() == null) {
            throw new IllegalArgumentException("O valor e obrigatorio");
        }
        if (row.dataVencimento() == null) {
            throw new IllegalArgumentException("A data de vencimento e obrigatoria");
        }

        Conta conta = buscarContaAtiva(row.contaId());
        Categoria categoria = buscarCategoria(row.categoriaId());
        Cliente cliente = row.clienteId() != null ? buscarCliente(row.clienteId()) : null;
        Fornecedor fornecedor = row.fornecedorId() != null ? buscarFornecedor(row.fornecedorId()) : null;

        LocalDateTime dataLancamento = row.dataLancamento() != null ? row.dataLancamento()
                : LocalDateTime.now();
        validarDatas(dataLancamento, row.dataVencimento());

        TipoLancamento tipo = row.tipo() != null ? row.tipo() : TipoLancamento.DESPESA;

        List<Lancamento> resultado = new ArrayList<>();

        if (row.totalParcelas() != null && row.totalParcelas() >= 2) {
            int n = row.totalParcelas();
            BigDecimal valorParcela = row.valor().divide(BigDecimal.valueOf(n), 2, RoundingMode.DOWN);
            BigDecimal ultimaValor = row.valor().subtract(valorParcela.multiply(BigDecimal.valueOf(n - 1)));

            for (int p = 1; p <= n; p++) {
                resultado.add(Lancamento.builder()
                        .descricao(row.descricao() + " " + p + "/" + n)
                        .parcela(p)
                        .totalParcela(n)
                        .valor(p == n ? ultimaValor : valorParcela)
                        .dataLancamento(dataLancamento)
                        .dataVencimento(row.dataVencimento().plusMonths(p - 1))
                        .situacao(PagamentoEnum.PENDENTE)
                        .tipo(tipo)
                        .conta(conta)
                        .categoria(categoria)
                        .cliente(cliente)
                        .fornecedor(fornecedor)
                        .build());
            }
        } else {
            resultado.add(Lancamento.builder()
                    .descricao(row.descricao())
                    .parcela(1)
                    .totalParcela(1)
                    .valor(row.valor())
                    .dataLancamento(dataLancamento)
                    .dataVencimento(row.dataVencimento())
                    .situacao(PagamentoEnum.PENDENTE)
                    .tipo(tipo)
                    .conta(conta)
                    .categoria(categoria)
                    .cliente(cliente)
                    .fornecedor(fornecedor)
                    .build());
        }

        return resultado;
    }

    @Transactional
    public List<LancamentoResponseDTO> criarParcelado(LancamentoParceladoRequestDto dto) {
        Conta conta = buscarContaAtiva(dto.getContaId());
        Categoria categoria = buscarCategoria(dto.getCategoriaId());
        Cliente cliente = dto.getClienteId() != null ? buscarCliente(dto.getClienteId()) : null;
        Fornecedor fornecedor = dto.getFornecedorId() != null ? buscarFornecedor(dto.getFornecedorId()) : null;

        LocalDateTime dataLancamento = dto.getDataLancamento() != null ? dto.getDataLancamento() : LocalDateTime.now();
        validarDatas(dataLancamento, dto.getDataVencimento());

        int n = dto.getTotalParcela();
        BigDecimal valorParcela = dto.getValorTotal().divide(BigDecimal.valueOf(n), 2, RoundingMode.DOWN);
        BigDecimal ultimaValor = dto.getValorTotal().subtract(valorParcela.multiply(BigDecimal.valueOf(n - 1)));

        List<Lancamento> parcelas = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            parcelas.add(Lancamento.builder()
                    .descricao(dto.getDescricao() + " " + i + "/" + n)
                    .parcela(i)
                    .totalParcela(n)
                    .valor(i == n ? ultimaValor : valorParcela)
                    .dataLancamento(dataLancamento)
                    .dataVencimento(dto.getDataVencimento().plusMonths(i - 1))
                    .situacao(PagamentoEnum.PENDENTE)
                    .tipo(dto.getTipo())
                    .conta(conta)
                    .categoria(categoria)
                    .cliente(cliente)
                    .fornecedor(fornecedor)
                    .build());
        }

        return lancamentoRepository.saveAll(parcelas).stream()
                .map(LancamentoMapper::toDto)
                .toList();
    }

    @Transactional
    public LancamentoResponseDTO atualizar(Long id, LancamentoRequestDto dto) {
        Lancamento lancamento = lancamentoRepository.findDetailedById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lancamento nao encontrado com id: " + id));

        Conta conta = dto.getContaId() != null ? buscarContaAtiva(dto.getContaId()) : null;
        Categoria categoria = dto.getCategoriaId() != null ? buscarCategoria(dto.getCategoriaId()) : null;
        Cliente cliente = dto.getClienteId() != null ? buscarCliente(dto.getClienteId()) : null;
        Fornecedor fornecedor = dto.getFornecedorId() != null ? buscarFornecedor(dto.getFornecedorId()) : null;

        if (dto.getDataLancamento() != null && dto.getDataVencimento() != null) {
            validarDatas(dto.getDataLancamento(), dto.getDataVencimento());
        }

        LancamentoMapper.updateEntity(lancamento, dto, conta, categoria, cliente, fornecedor);
        return LancamentoMapper.toDto(lancamentoRepository.save(lancamento));
    }

    @Transactional
    public LancamentoStatusResponseDTO atualizarSituacao(Long id) {
        Lancamento lancamento = lancamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lancamento nao encontrado com id: " + id));

        String mensagem;
        if (lancamento.getSituacao() == PagamentoEnum.PENDENTE) {
            lancamento.setSituacao(PagamentoEnum.PAGO);
            mensagem = "Lancamento marcado como pago";
        } else {
            lancamento.setSituacao(PagamentoEnum.PENDENTE);
            mensagem = "Lancamento revertido para pendente";
        }
        lancamentoRepository.save(lancamento);
        return new LancamentoStatusResponseDTO(lancamento.getId(), lancamento.getSituacao(), mensagem);
    }

    @Transactional
    public void deletar(Long id) {
        if (!lancamentoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lancamento nao encontrado com id: " + id);
        }
        lancamentoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public void exportarCsv(PrintWriter writer) {
        writer.println(
                "id,descricao,valor,parcela,totalParcela,dataLancamento,dataVencimento,situacao,tipo,conta,categoria,cliente,fornecedor");

        try (Stream<Lancamento> stream = lancamentoRepository.streamAll()) {
            stream.forEach(l -> writer.println(formatarLinhaCsv(l)));
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<LancamentoResponseDTO> listar(
            String descricao,
            PagamentoEnum situacao,
            TipoLancamento tipo,
            Long contaId,
            Long categoriaId,
            Long clienteId,
            Long fornecedorId,
            LocalDateTime dataLancamentoDe,
            LocalDateTime dataLancamentoAte,
            LocalDateTime dataVencimentoDe,
            LocalDateTime dataVencimentoAte,
            PaginationRequest pagination) {

        Specification<Lancamento> spec = (root, query, cb) -> cb.conjunction();

        if (descricao != null && !descricao.isBlank()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(cb.lower(root.get("descricao")), "%" + descricao.toLowerCase() + "%"));
        }
        if (situacao != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
        }
        if (tipo != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("tipo"), tipo));
        }
        if (contaId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("conta").get("id"), contaId));
        }
        if (categoriaId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("categoria").get("id"), categoriaId));
        }
        if (clienteId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("cliente").get("id"), clienteId));
        }
        if (fornecedorId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("fornecedor").get("id"), fornecedorId));
        }
        if (dataLancamentoDe != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dataLancamento"), dataLancamentoDe));
        }
        if (dataLancamentoAte != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.lessThanOrEqualTo(root.get("dataLancamento"), dataLancamentoAte));
        }
        if (dataVencimentoDe != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dataVencimento"), dataVencimentoDe));
        }
        if (dataVencimentoAte != null) {
            spec = spec.and(
                    (root, query, cb) -> cb.lessThanOrEqualTo(root.get("dataVencimento"), dataVencimentoAte));
        }

        Page<LancamentoResponseDTO> page = lancamentoRepository
                .findAll(spec, pagination.toPageable("dataVencimento"))
                .map(LancamentoMapper::toDto);
        return PageResponse.from(page);
    }

    @Transactional(readOnly = true)
    public LancamentoResumoDTO resumo() {
        LancamentoResumoProjection agg = lancamentoRepository.resumir();
        if (agg == null || agg.getTotal() == null) {
            return new LancamentoResumoDTO(0, 0, 0, 0);
        }
        BigDecimal receita = agg.getReceita() != null ? agg.getReceita() : BigDecimal.ZERO;
        BigDecimal despesa = agg.getDespesa() != null ? agg.getDespesa() : BigDecimal.ZERO;
        BigDecimal saldo = receita.subtract(despesa);
        return new LancamentoResumoDTO(agg.getTotal(), receita.doubleValue(), despesa.doubleValue(),
                saldo.doubleValue());
    }

    @Transactional(readOnly = true)
    public LancamentoResponseDTO obterPorId(Long id) {
        return lancamentoRepository.findDetailedById(id)
                .map(LancamentoMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Lancamento nao encontrado com id: " + id));
    }

    private Conta buscarContaAtiva(Long id) {
        Conta conta = contaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Conta nao encontrada com id: " + id));
        if (conta.getSituacao() == Situacao.INATIVO) {
            throw new BusinessException("Nao e possivel criar um lancamento para uma conta inativa.");
        }
        return conta;
    }

    private Categoria buscarCategoria(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nao encontrada com id: " + id));
    }

    private Cliente buscarCliente(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente nao encontrado com id: " + id));
    }

    private Fornecedor buscarFornecedor(Long id) {
        return fornecedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor nao encontrado com id: " + id));
    }

    private void validarDatas(LocalDateTime dataLancamento, LocalDateTime dataVencimento) {
        if (dataVencimento.isBefore(dataLancamento)) {
            throw new IllegalArgumentException("Data de vencimento nao pode ser anterior a data de lancamento.");
        }
    }

    private void validarFicheiro(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Ficheiro nao enviado ou esta vazio");
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".csv")) {
            throw new BusinessException("Apenas ficheiros CSV sao permitidos");
        }
    }

    private List<String> lerLinhasCSV(MultipartFile file) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            return reader.lines()
                    .skip(1)
                    .filter(l -> !l.isBlank())
                    .toList();
        } catch (IOException e) {
            throw new BusinessException("Erro ao ler o ficheiro CSV: " + e.getMessage());
        }
    }

    private LancamentoCsvRow parseLinha(String linha) {
        String[] cols = linha.split(",", -1);
        if (cols.length < 7) {
            throw new IllegalArgumentException("Linha invalida (minimo 7 colunas): " + linha);
        }
        String descricao = cols[0].trim();
        BigDecimal valor = new BigDecimal(cols[1].trim());
        Integer totalParcelas = cols[2].isBlank() ? null : Integer.parseInt(cols[2].trim());
        LocalDateTime dataLancamento = cols[3].isBlank() ? null : LocalDateTime.parse(cols[3].trim());
        LocalDateTime dataVencimento = LocalDateTime.parse(cols[4].trim());
        Long contaId = Long.parseLong(cols[5].trim());
        Long categoriaId = Long.parseLong(cols[6].trim());
        Long clienteId = cols.length > 7 && !cols[7].isBlank() ? Long.parseLong(cols[7].trim()) : null;
        Long fornecedorId = cols.length > 8 && !cols[8].isBlank() ? Long.parseLong(cols[8].trim()) : null;
        TipoLancamento tipo = cols.length > 9 && !cols[9].isBlank()
                ? TipoLancamento.valueOf(cols[9].trim().toUpperCase())
                : null;
        return new LancamentoCsvRow(descricao, valor, totalParcelas, dataLancamento, dataVencimento,
                contaId, categoriaId, clienteId, fornecedorId, tipo);
    }

    private String formatarLinhaCsv(Lancamento l) {
        String conta = l.getConta() != null ? MapperText.escape(l.getConta().getNome()) : "";
        String categoria = l.getCategoria() != null ? MapperText.escape(l.getCategoria().getNome()) : "";
        String cliente = l.getCliente() != null ? MapperText.escape(l.getCliente().getNomeEmpresarial()) : "";
        String fornecedor = l.getFornecedor() != null ? MapperText.escape(l.getFornecedor().getNomeEmpresarial()) : "";

        return l.getId() + ","
                + MapperText.escape(l.getDescricao()) + ","
                + l.getValor() + ","
                + l.getParcela() + ","
                + l.getTotalParcela() + ","
                + l.getDataLancamento() + ","
                + l.getDataVencimento() + ","
                + l.getSituacao() + ","
                + l.getTipo() + ","
                + conta + ","
                + categoria + ","
                + cliente + ","
                + fornecedor;
    }

}