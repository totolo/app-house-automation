package home_automation;

/**
 * Simple class to capture the configurable properties of a Home.
 * Home is a singleton that cannot be extended.
 *
 * @author hwang
 */
public final class Home {

    // default to a comfortable 70 degrees
    private static int temperature = 70;
    private static boolean lightOn = false;
    private static boolean curtainOpen = false;

    private static final Home instance = new Home();

    public Home() {}

    public static Home getInstance() {
        return instance;
    }
    public int getTemperature() {
        return temperature;
    }

    public synchronized void setTemperature(final int temperature) {
        this.temperature = temperature;
    }

    public boolean isLightOn() {
        return lightOn;
    }

    public synchronized void setLightOn(final boolean lightOn) {
        this.lightOn = lightOn;
    }

    public boolean isCurtainOpen() {
        return curtainOpen;
    }

    public synchronized void setCurtainOpen(final boolean curtainOpen) {
        this.curtainOpen = curtainOpen;
    }
}
