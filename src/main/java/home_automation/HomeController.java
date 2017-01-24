package home_automation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import home_automation.model.BooleanRequest;

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

        final boolean on = requestBody.isActive();

        // we check whether we need to take action before we proceed with the costly
        // synchronized call to setLightOn
        if(on != home.isLightOn()) {
            home.setLightOn(on);
        }
        return ResponseEntity.ok().body("The lights are turned " + (home.isLightOn() ? "on" : "off"));
    }

    /**
     * Set curtain to open or closed.
     * @param open whether the curtains are open or closed
     * @return the response with a message indicating whether curtains are open or closed.
     */
    @RequestMapping("/set/curtain/{open}")
    public ResponseEntity setCurtain(@PathVariable("open") final boolean open) {

        // we check whether we need to take action before we proceed with the costly
        // synchronized call to setCurtainOn
        if(open != home.isCurtainOpen()) {
            home.setCurtainOpen(open);
        }
        return ResponseEntity.ok().body("The curtains are " + (home.isCurtainOpen() ? "open" : "shut"));
    }

    /**
     * Set the home temperature
     * @param temp the temperature in Fahrenheit. this number should always be an integer
     * @return the response with a message indicating whether curtains are open or closed.
     */
    @RequestMapping("/set/temperature/{temp}")
    public ResponseEntity setTemperature(@PathVariable("temp") final int temp) {

        // we check whether we need to take action before we proceed with the costly
        // synchronized call to setCurtainOn
        if(temp != home.getTemperature()) {
            home.setTemperature(temp);
        }
        return ResponseEntity.ok().body("The current home temperature is set to " + home.getTemperature() + " Fahrenheit");
    }


    @RequestMapping("/light")
    public ResponseEntity isLightOn() {
        return ResponseEntity.ok(home.isLightOn());
    }

    @RequestMapping("/curtain")
    public ResponseEntity isCurtainOpen() {
        return ResponseEntity.ok(home.isCurtainOpen());
    }

    @RequestMapping("/temperature")
    public ResponseEntity getTemperature() {
        return ResponseEntity.ok(home.getTemperature());
    }

    public static void main(String[] args) throws Exception {
        SpringApplication.run(HomeController.class, args);
    }

}