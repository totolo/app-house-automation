package home_automation.model;

/**
 * @author hwang
 */
public class BooleanResponse {

    private final boolean value;
    private final String message;

    public BooleanResponse(boolean value, String message) {
        this.value = value;
        this.message = message;
    }

    public boolean isValue() {
        return value;
    }

    public String getMessage() {
        return message;
    }
}
