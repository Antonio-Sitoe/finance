package com.finance.finance.modules.contacto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.finance.finance.modules.contacto.model.Contacto;

public interface ContactoRepository extends JpaRepository<Contacto, Long> {

    /**
     * Valida se existe conflito de email ou telefone para um cliente
     * Retorna: "email" se existe email igual, "telefone" se existe telefone igual, "none" se nenhum conflito
     */
    @Query("SELECT CASE " +
           "WHEN EXISTS(SELECT 1 FROM Contacto c WHERE c.cliente.id = :clienteId AND c.email = :email) THEN 'email' " +
           "WHEN EXISTS(SELECT 1 FROM Contacto c WHERE c.cliente.id = :clienteId AND c.telefone = :telefone) THEN 'telefone' " +
           "ELSE 'none' END")
    String checkConflictByClienteIdAndEmailAndTelefone(@Param("clienteId") Long clienteId, 
                                                        @Param("email") String email, 
                                                        @Param("telefone") String telefone);
}