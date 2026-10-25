package me.app.nongki.controller;


import me.app.nongki.entity.Space;
import me.app.nongki.service.SpaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static me.app.nongki.util.ResponseUtil.response;

@RequestMapping("/api/spaces")
@RestController
public class SpaceController {

  private final SpaceService spaceService;

  public SpaceController(SpaceService spaceService) {
    this.spaceService = spaceService;
  }

  @GetMapping
  public ResponseEntity<?> all(
      @RequestParam(name = "categoryId", required = false) String categoryId,
      @RequestParam(name = "type", required = false) String spaceType,
      @RequestParam(name = "date") String date,
      @RequestParam(name = "start") int startTime,
      @RequestParam(name = "end") int endTime
  ) {
    final List<Space> spaces = spaceService.getSpaces(categoryId, spaceType, date, startTime, endTime);
    if (spaces.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    return ResponseEntity.ok().body(response(true, "Successfully retrieve spaces", spaces));
  }

  @GetMapping(value = "/{id}")
  public ResponseEntity<?> one(@PathVariable String id) {
    Space space = spaceService.getSpaceById(id);
    if (space == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok().body(response(true, "Successfully retrieve the space", space));
  }

  @PostMapping
  public ResponseEntity<?> create(@RequestBody Space space) {
    Space createdSpace = spaceService.createSpace(space);
    return ResponseEntity.ok().body(response(true, "Successfully created space", createdSpace));
  }

}
