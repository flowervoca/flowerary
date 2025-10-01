package com.example.flowery_backend.Controller;

import com.example.flowery_backend.Service.FlowerService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.xml.bind.JAXBException;


@Controller
public class HomeController {
    private final FlowerService flowerService;

    public HomeController(FlowerService flowerService) {
        this.flowerService = flowerService;
    }

    @GetMapping("/")
    public String home(Model model) throws JAXBException {
        model.addAttribute("flowers", flowerService.searchFlowersWithFilters(null, null, null, null)); // Add the flowers list to the model
        return "index";
    }

    @GetMapping("/sync")
    public String sync(Model model) throws JAXBException {
        flowerService.sync();
        model.addAttribute("flowers", flowerService.searchFlowersWithFilters(null, null, null, null)); // Add the flowers list to the model
        return "index";
    }

    @GetMapping("/map")
    public String test(Model model) throws JAXBException {
        model.addAttribute("apiKey", "8e4b7ef897334b13b8b3d473be01f42e"); // Add the flowers list to the model
        return "map";
    }


}
