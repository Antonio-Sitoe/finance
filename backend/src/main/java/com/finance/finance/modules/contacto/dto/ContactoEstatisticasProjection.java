package com.finance.finance.modules.contacto.dto;

public interface ContactoEstatisticasProjection {

    Long getTotalEmpresas();

    Long getTotalContactos();

    Double getMediaContactosPorEmpresa();

    Long getEmpresasComContactos();

    Long getEmpresasSemContactos();
}