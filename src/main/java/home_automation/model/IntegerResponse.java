package home_automation.model;

/**
 * @author hwang
 */
public class IntegerResponse {

    private final int value;
    private final String message;

    public IntegerResponse(int value, String message) {
        this.value = value;
        this.message = message;
    }

    public int getValue() {
        return value;
    }

    public String getMessage() {
        return message;
    }
}
