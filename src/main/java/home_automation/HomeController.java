package home_automation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import home_automation.model.BooleanRequest;
import home_automation.model.BooleanResponse;
import home_automation.model.IntegerRequest;
import home_automation.model.IntegerResponse;

/**
 * Simple Spring Boot Application to serve UI/rest endpoints.
 *
 * To get started, we referred to
 * http://docs.spring.io/spring-boot/docs/current/reference/html/getting-started-first-application.html
 *
 * @author hwang
 */
@RestController
@EnableAutoConfiguration
public class HomeController {

    private final Home home;

    public HomeController() {
        this.home = Home.getInstance();
    }

    /**
     * Turn light on or off. Minimize calls to costly synchronized set method.
     * @param requestBody contains property on whether to turn on lights
     * @return the response with message indicating whether lights are turned on
     */
    @RequestMapping("/set/light")
    @ResponseBody
    public ResponseEntity setLight(@RequestBody final BooleanRequest requestBody) {

        final boolean on = requestBody.isValue();

        // we check whether we need to take action before we proceed with the costly
        // synchronized call to setLightOn
        if(on != home.isLightOn()) {
            home.setLightOn(on);
        }
        return ResponseEntity.ok().body(new BooleanResponse(home.isLightOn(), "The lights are turned " + (home.isLightOn() ? "on" : "off")));
    }

    /**
     * Set curtain to open or closed.
     * @param requestBody whether the curtains are open or closed
     * @return the response with a message indicating whether curtains are open or closed.
     */
    @RequestMapping("/set/curtain")
    public ResponseEntity setCurtain(@RequestBody final BooleanRequest requestBody) {
        final boolean open = requestBody.isValue();

        // we check whether we need to take action before we proceed with the costly
        // synchronized call to setCurtainOn
        if(open != home.isCurtainOpen()) {
            home.setCurtainOpen(open);
        }
        //return ResponseEntity.ok().body("The curtains are " + (home.isCurtainOpen() ? "open" : "shut"));
        return ResponseEntity.ok().body(new BooleanResponse(home.isCurtainOpen(), "The curtains are " + (home.isCurtainOpen() ? "open" : "shut")));
    }

    /**
     * Set the home temperature
     * @param tempBody the temperature in Fahrenheit. this number should always be an integer
     * @return the response with a message indicating whether curtains are open or closed.
     */
    @RequestMapping("/set/temperature")
    public ResponseEntity setTemperature(@RequestBody final IntegerRequest tempBody) {
        final int temp = tempBody.getValue();
        // we check whether we need to take action before we proceed with the costly
        // synchronized call to setCurtainOn
        if(temp != home.getTemperature()) {
            home.setTemperature(temp);
        }
        return ResponseEntity.ok().body(new IntegerResponse(home.getTemperature(), "The current home temperature is set to " + home.getTemperature() + " Fahrenheit"));
    }


    /**
     * Get the state of the light
     * @return whether the light is on
     */
    @RequestMapping("/light")
    public ResponseEntity isLightOn() {
        return ResponseEntity.ok(home.isLightOn());
    }

    /**
     * Get the state of the curtains
     * @return whether the curtains are open
     */
    @RequestMapping("/curtain")
    public ResponseEntity isCurtainOpen() {
        return ResponseEntity.ok(home.isCurtainOpen());
    }

    /**
     * Get the temperature
     * @return what the temperature is
     */
    @RequestMapping("/temperature")
    public ResponseEntity getTemperature() {
        return ResponseEntity.ok(home.getTemperature());
    }

    /**
     * Get the state of the whole home
     * @return the object containing the state of all devices
     */
    @RequestMapping("/all")
    public ResponseEntity getAllDeviceStates() {
        return ResponseEntity.ok(home);
    }


    public static void main(String[] args) throws Exception {
        SpringApplication.run(HomeController.class, args);
    }

}