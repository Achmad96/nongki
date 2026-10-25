package me.app.nongki.controller;

import me.app.nongki.entity.Space;
import me.app.nongki.service.OrderService;
import me.app.nongki.service.SpaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static me.app.nongki.util.ResponseUtil.response;

@RequestMapping("/api/spaces")
@RestController
public class SpaceController {

  private final SpaceService spaceService;
  private final OrderService orderService;

  public SpaceController(SpaceService spaceService, OrderService orderService) {
    this.spaceService = spaceService;
    this.orderService = orderService;
  }

  @GetMapping
  public ResponseEntity<?> all(
      @RequestParam(name = "categoryId", required = false) String categoryId,
      @RequestParam(name = "type", required = false) String spaceType,
      @RequestParam(name = "date", required = false) String date,
      @RequestParam(name = "start", required = false) Integer startTime,
      @RequestParam(name = "end", required = false) Integer endTime
  ) {
    if (categoryId == null && spaceType == null && date == null && startTime == null && endTime == null) {
      final List<Space> spaces = spaceService.getAllSpaces();
      return ResponseEntity.ok().body(response(true, "Successfully retrieved all spaces", spaces));
    }
    final List<Space> spaces = spaceService.getSpaces(categoryId, spaceType, date, startTime, endTime);
    return ResponseEntity.ok().body(response(true, "Successfully retrieve spaces", spaces));
  }

  @GetMapping("/booked-desks")
  public ResponseEntity<?> bookedDesks(
      @RequestParam(name = "date") String date,
      @RequestParam(name = "start") int startTime,
      @RequestParam(name = "end") int endTime
  ) {
    List<String> bookedCodes = orderService.getBookedDesks(date, startTime, endTime);
    return ResponseEntity.ok().body(response(true, "Successfully retrieved booked desks", bookedCodes));
  }

  @GetMapping(value = "/{id}")
  public ResponseEntity<?> one(@PathVariable String id) {
    Space space = spaceService.getSpaceById(id);
    return ResponseEntity.ok().body(response(true, "Successfully retrieved space", space));
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody Space space) {
    Space createdSpace = spaceService.createSpace(space);
    return ResponseEntity.ok().body(response(true, "Successfully created space", createdSpace));
  }
}
