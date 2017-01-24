package home_automation.model;

/**
 * The response body for boolean type requests.
 * For example, turning on lights or curtains.
 *
 * @author hwang
 */

public class BooleanState {

    private boolean state;

    public BooleanState() {
    }

    public BooleanState(final boolean state) {
        this.state = state;
    }

    public boolean isState() {
        return state;
    }

    public void setState(final boolean state) {
        this.state = state;
    }
}
