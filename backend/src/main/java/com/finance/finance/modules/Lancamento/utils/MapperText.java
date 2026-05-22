package com.finance.finance.modules.Lancamento.utils;

public class MapperText {
    public static String escape(String value) {
        if (value == null)
            return "";
        return "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
