package com.finance.finance.modules.clientes.dto;

import com.finance.finance.modules.common.enums.Situacao;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@Schema(name = "ClienteResponse", description = "Representação de um cliente na API")
public class ClienteResponseDTO {
    @Schema(description = "ID do cliente", example = "25")
    private Long id;
    @Schema(description = "Nome empresarial", example = "Roberto Mugaia")
    private String nomeEmpresarial;
    @Schema(description = "Email", example = "roberto@gmail.com")
    private String email;
    @Schema(description = "Telefone", example = "+258841234567")
    private String telefone;
    @Schema(description = "Endereço", example = "Av. Julius Nyerere")
    private String endereco;
    @Schema(description = "Número", example = "10")
    private String numero;
    @Schema(description = "Complemento", example = "2º andar")
    private String complemento;
    @Schema(description = "Cidade", example = "Maputo Cidade")
    private String cidade;
    @Schema(description = "Estado ou província", example = "MPT")
    private String estado;
    @Schema(description = "Nota", example = "10")
    private Integer nota;
    @Schema(description = "Situação", example = "ATIVO")
    private Situacao situacao;
}