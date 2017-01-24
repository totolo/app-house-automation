package home_automation.model;

/**
 * The response body for boolean type requests.
 * For example, turning on lights or curtains.
 *
 * @author hwang
 */

public class BooleanRequest {

    private boolean active;

    public BooleanRequest() {
    }

    public BooleanRequest(final boolean active) {
        this.active = active;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(final boolean active) {
        this.active = active;
    }
}
