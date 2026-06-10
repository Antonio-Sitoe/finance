package com.finance.finance.modules.contacto.service;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finance.finance.exceptions.BusinessException;
import com.finance.finance.exceptions.ResourceNotFoundException;
import com.finance.finance.modules.clientes.model.Cliente;
import com.finance.finance.modules.clientes.repository.ClienteRepository;
import com.finance.finance.modules.common.enums.Situacao;
import com.finance.finance.modules.common.pagination.PageResponse;
import com.finance.finance.modules.common.pagination.PaginationRequest;
import com.finance.finance.modules.contacto.dto.ContactoEstatisticasResponseDTO;
import com.finance.finance.modules.contacto.dto.ContactoEstatisticasProjection;
import com.finance.finance.modules.contacto.dto.ContactoPorClienteResponseDTO;
import com.finance.finance.modules.contacto.dto.ContactoRequestDTO;
import com.finance.finance.modules.contacto.dto.ContactoResponseDTO;
import com.finance.finance.modules.contacto.dto.ContactoStatusResponseDTO;
import com.finance.finance.modules.contacto.mapper.ContactoMapper;
import com.finance.finance.modules.contacto.model.Contacto;
import com.finance.finance.modules.contacto.repository.ContactoRepository;

@Service
@RequiredArgsConstructor
public class ContactoService {

        private final ContactoRepository contactoRepository;
        private final ClienteRepository clienteRepository;

        @Transactional
        public ContactoResponseDTO criar(ContactoRequestDTO novoContacto) {
                Cliente cliente = validateCheckCliente(novoContacto);
                Contacto contacto = ContactoMapper.toEntity(novoContacto, cliente);
                Contacto contactoSalvo = contactoRepository.save(contacto);
                return ContactoMapper.toDto(contactoSalvo);
        }

        @Transactional
        public ContactoResponseDTO atualizar(Long id, ContactoRequestDTO dto) {
                Contacto contacto = contactoRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Contacto não encontrado com id: " + id));

                if (dto.getEmail() != null &&
                                contactoRepository.existsByClienteIdAndEmailAndIdNot(contacto.getCliente().getId(),
                                                dto.getEmail(), id)) {
                        throw new BusinessException("Já existe um contacto com este email para este cliente");
                }

                if (dto.getTelefone() != null &&
                                contactoRepository.existsByClienteIdAndTelefoneAndIdNot(contacto.getCliente().getId(),
                                                dto.getTelefone(), id)) {
                        throw new BusinessException("Já existe um contacto com este telefone para este cliente");
                }

                ContactoMapper.updateEntityFromDto(dto, contacto);
                return ContactoMapper.toDto(contactoRepository.save(contacto));
        }

        @Transactional
        public ContactoStatusResponseDTO activarOuDesativar(Long id) {
                Contacto contacto = contactoRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Contacto não encontrado com id: " + id));

                String mensagem;
                if (contacto.getSituacao() == Situacao.ATIVO) {
                        contacto.setSituacao(Situacao.INATIVO);
                        mensagem = "Contacto desativado com sucesso";
                } else {
                        contacto.setSituacao(Situacao.ATIVO);
                        mensagem = "Contacto ativado com sucesso";
                }

                contactoRepository.save(contacto);
                return new ContactoStatusResponseDTO(contacto.getId(), contacto.getSituacao(), mensagem);
        }

        @Transactional(readOnly = true)
        public PageResponse<ContactoResponseDTO> listar(Long clienteId, String nome, String departamento,
                        Situacao situacao, PaginationRequest paginationRequest) {
                Pageable pageable = paginationRequest.toPageable("nome");
                Specification<Contacto> spec = Specification.unrestricted();
                if (clienteId != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("cliente").get("id"), clienteId));
                }
                if (nome != null && !nome.isBlank()) {
                        spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("nome")),
                                        "%" + nome.trim().toLowerCase() + "%"));
                }
                if (departamento != null && !departamento.isBlank()) {
                        spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("departamento")),
                                        "%" + departamento.trim().toLowerCase() + "%"));
                }
                if (situacao != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
                }
                return PageResponse.from(contactoRepository.findAll(spec, pageable).map(ContactoMapper::toDto));
        }

        @Transactional(readOnly = true)
        public ContactoResponseDTO obterPorId(Long id) {
                Contacto contacto = contactoRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Contacto não encontrado com id: " + id));
                return ContactoMapper.toDto(contacto);
        }

        @Transactional(readOnly = true)
        public PageResponse<ContactoResponseDTO> listarPorCliente(Long clienteId, String nome,
                        String departamento, Situacao situacao, PaginationRequest paginationRequest) {
                clienteRepository.findById(clienteId)
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cliente não encontrado com id: " + clienteId));

                Pageable pageable = paginationRequest.toPageable("nome");
                Specification<Contacto> spec = (root, query, cb) -> cb.equal(root.get("cliente").get("id"), clienteId);

                if (nome != null && !nome.isBlank()) {
                        spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("nome")),
                                        "%" + nome.trim().toLowerCase() + "%"));
                }
                if (departamento != null && !departamento.isBlank()) {
                        spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("departamento")),
                                        "%" + departamento.trim().toLowerCase() + "%"));
                }
                if (situacao != null) {
                        spec = spec.and((root, query, cb) -> cb.equal(root.get("situacao"), situacao));
                }

                return PageResponse.from(contactoRepository.findAll(spec, pageable).map(ContactoMapper::toDto));
        }

        @Transactional(readOnly = true)
        public List<ContactoPorClienteResponseDTO> contactosPorClientesEstaticticas() {
                return contactoRepository.countContactosPorCliente();
        }

        @Transactional(readOnly = true)
        public ContactoEstatisticasResponseDTO obterEstatisticasContactosPorEmpresa() {
                ContactoEstatisticasProjection estatisticas = contactoRepository.obterEstatisticasContactosPorEmpresa();

                return ContactoEstatisticasResponseDTO.builder()
                                .totalEmpresas(valorLong(estatisticas.getTotalEmpresas()))
                                .totalContactos(valorLong(estatisticas.getTotalContactos()))
                                .mediaContactosPorEmpresa(valorDouble(estatisticas.getMediaContactosPorEmpresa()))
                                .empresasComContactos(valorLong(estatisticas.getEmpresasComContactos()))
                                .empresasSemContactos(valorLong(estatisticas.getEmpresasSemContactos()))
                                .build();
        }

        private long valorLong(Number value) {
                return value != null ? value.longValue() : 0L;
        }

        private double valorDouble(Number value) {
                return value != null ? value.doubleValue() : 0.0d;
        }

        private Cliente validateCheckCliente(ContactoRequestDTO contacto) {
                Cliente cliente = clienteRepository.findById(contacto.getClienteId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Cliente não encontrado com id: " + contacto.getClienteId()));

                String conflict = contactoRepository.checkConflictByClienteIdAndEmailAndTelefone(
                                contacto.getClienteId(),
                                contacto.getEmail(),
                                contacto.getTelefone());

                if ("email".equals(conflict)) {
                        throw new BusinessException("Já existe um contacto com este email para este cliente");
                }
                if ("telefone".equals(conflict)) {
                        throw new BusinessException("Já existe um contacto com este telefone para este cliente");
                }

                return cliente;
        }
}
