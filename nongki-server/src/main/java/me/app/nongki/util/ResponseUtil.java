package me.app.nongki.util;

import java.util.Date;
import java.util.HashMap;

public class ResponseUtil {
    /**
     * Generates a standard response format.
     *
     * @param status  Indicates success or failure of the operation.
     * @param message A message providing additional context about the response.
     * @param data    The data to be included in the response, can be null.
     * @return A HashMap containing the response structure.
     */
    public static HashMap<String, Object> response(boolean status, String message, Object data) {
        return new HashMap<>() {{
            put("success", status);
            put("message", message);
            put("data", data);
            put("timestamp", new Date());
        }};
    }
}
