package me.app.nongki.specification;

import jakarta.persistence.criteria.*;
import me.app.nongki.criteria.SpaceCriteria;
import me.app.nongki.entity.OrderDetail;
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
  public Predicate toPredicate(Root root, CriteriaQuery query, CriteriaBuilder criteriaBuilder) {
    final List<Predicate> predicates = new ArrayList<>();
    if (criteria.getCategoryId() != null) {
      final Predicate categoryPredicate = criteriaBuilder.equal(root.get("categoryId"), criteria.getCategoryId());
      predicates.add(categoryPredicate);
    }
    if (criteria.getType() != null) {
      final Predicate typePredicate = criteriaBuilder.equal(root.get("type"), criteria.getType());
      predicates.add(typePredicate);
    }

    assert criteria.getStartTime() != null && criteria.getEndTime() != null : "Start Time and End Time must not be null";
    // Create subquery to check for conflicting bookings
    Subquery<Long> conflictSubquery = query.subquery(Long.class);
    Root<OrderDetail> subRoot = conflictSubquery.from(OrderDetail.class);

    conflictSubquery.select(criteriaBuilder.count(subRoot))
      .where(criteriaBuilder.and(
        criteriaBuilder.equal(subRoot.get("space"), root),
        // Check for time overlap: new booking conflicts if:
        // (new_start < existing_end) AND (new_end > existing_start)
        criteriaBuilder.lessThan(criteriaBuilder.literal(criteria.getStartTime()), subRoot.get("endTime")),
        criteriaBuilder.greaterThan(criteriaBuilder.literal(criteria.getEndTime()), subRoot.get("startTime"))
      ));

    // Only return spaces that have NO conflicting bookings
    predicates.add(criteriaBuilder.equal(conflictSubquery, 0L));
    return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
  }
}

