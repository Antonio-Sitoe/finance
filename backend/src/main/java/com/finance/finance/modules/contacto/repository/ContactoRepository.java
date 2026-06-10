package com.finance.finance.modules.contacto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.contacto.dto.ContactoEstatisticasProjection;
import com.finance.finance.modules.contacto.dto.ContactoPorClienteResponseDTO;
import com.finance.finance.modules.contacto.model.Contacto;
import java.util.List;

public interface ContactoRepository extends JpaRepository<Contacto, Long>, JpaSpecificationExecutor<Contacto> {

        @Query("SELECT CASE " +
                        "WHEN EXISTS(SELECT 1 FROM Contacto c WHERE c.cliente.id = :clienteId AND c.email = :email) THEN 'email' "
                        +
                        "WHEN EXISTS(SELECT 1 FROM Contacto c WHERE c.cliente.id = :clienteId AND c.telefone = :telefone) THEN 'telefone' "
                        +
                        "ELSE 'none' END")
        String checkConflictByClienteIdAndEmailAndTelefone(@Param("clienteId") Long clienteId,
                        @Param("email") String email,
                        @Param("telefone") String telefone);

        boolean existsByClienteIdAndEmailAndIdNot(Long clienteId, String email, Long id);

        boolean existsByClienteIdAndTelefoneAndIdNot(Long clienteId, String telefone, Long id);

        List<Contacto> findByClienteId(Long clienteId);

        @Query("SELECT new com.finance.finance.modules.contacto.dto.ContactoPorClienteResponseDTO(" +
                        "ct.cliente.id, cl.nomeEmpresarial, COUNT(ct)) " +
                        "FROM Contacto ct " +
                        "LEFT JOIN ct.cliente cl " +
                        "GROUP BY ct.cliente.id, cl.nomeEmpresarial")
        List<ContactoPorClienteResponseDTO> countContactosPorCliente();

        @Query(value = """
                            SELECT
                                    CAST(COUNT(*) AS BIGINT) AS totalEmpresas,
                                    CAST(COALESCE(SUM(total_contactos), 0) AS BIGINT) AS totalContactos,
                                    CAST(COALESCE(ROUND(AVG(total_contactos), 2), 0) AS DOUBLE PRECISION) AS mediaContactosPorEmpresa,
                                    CAST(COUNT(*) FILTER (WHERE total_contactos > 0) AS BIGINT) AS empresasComContactos,
                                    CAST(COUNT(*) FILTER (WHERE total_contactos = 0) AS BIGINT) AS empresasSemContactos
                            FROM (
                            SELECT
                                    cl.id,
                                    COUNT(ct.id) AS total_contactos
                            FROM clientes cl
                            LEFT JOIN contactos ct
                                    ON cl.id = ct.cliente_id
                            GROUP BY cl.id
                            ) t
                        """, nativeQuery = true)
        ContactoEstatisticasProjection obterEstatisticasContactosPorEmpresa();

}
