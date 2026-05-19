package com.finance.finance.modules.contacto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.contacto.model.Contacto;

public interface ContactoRepository extends JpaRepository<Contacto, Long>, JpaSpecificationExecutor<Contacto> {

    @Query("SELECT CASE " +
            "WHEN EXISTS(SELECT 1 FROM Contacto c WHERE c.cliente.id = :clienteId AND c.email = :email) THEN 'email' " +
            "WHEN EXISTS(SELECT 1 FROM Contacto c WHERE c.cliente.id = :clienteId AND c.telefone = :telefone) THEN 'telefone' " +
            "ELSE 'none' END")
    String checkConflictByClienteIdAndEmailAndTelefone(@Param("clienteId") Long clienteId,
            @Param("email") String email,
            @Param("telefone") String telefone);

    boolean existsByClienteIdAndEmailAndIdNot(Long clienteId, String email, Long id);

    boolean existsByClienteIdAndTelefoneAndIdNot(Long clienteId, String telefone, Long id);
}
