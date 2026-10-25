package me.app.nongki.specification;

import jakarta.persistence.criteria.*;
import me.app.nongki.criteria.SpaceCriteria;
import me.app.nongki.entity.Space;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class SpaceSpecification implements Specification<Space> {

  private final SpaceCriteria criteria;

  public SpaceSpecification(SpaceCriteria criteria) {
    this.criteria = criteria;
  }

  @Override
  public Predicate toPredicate(Root<Space> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
    final List<Predicate> predicates = new ArrayList<>();
    if (criteria.getCategoryId() != null && !criteria.getCategoryId().isBlank()) {
      try {
        predicates.add(criteriaBuilder.equal(root.get("category").get("id"), criteria.getCategoryId()));
      } catch (Exception e) {
        predicates.add(criteriaBuilder.equal(root.get("category").get("name"), criteria.getCategoryId()));
      }
    }
    if (criteria.getType() != null && !criteria.getType().isBlank()) {
      predicates.add(criteriaBuilder.equal(root.get("type"), criteria.getType()));
    }
    return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
  }
}
