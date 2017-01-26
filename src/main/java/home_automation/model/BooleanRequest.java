package home_automation.model;

/**
 * The response body for boolean type requests.
 * For example, turning on lights or curtains.
 *
 * @author hwang
 */

public class BooleanRequest {

    private boolean value;

    public BooleanRequest() {
    }

    public BooleanRequest(final boolean value) {
        this.value = value;
    }

    public boolean isValue() {
        return value;
    }

    public void setValue(final boolean value) {
        this.value = value;
    }
}
