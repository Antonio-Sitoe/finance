package com.finance.finance.modules.categoria.utils;

public class CategoriaUtils {

    private CategoriaUtils() {
    }

    public static String buildChaveDuplicata(String nome, Long categoriaPaiId) {
        return nome.toLowerCase() + "|" + (categoriaPaiId != null ? categoriaPaiId : "null");
    }

    public static String getNomeDisplay(String nome, int pos) {
        return (nome != null && !nome.isBlank()) ? nome : "(item " + pos + ")";
    }
}
