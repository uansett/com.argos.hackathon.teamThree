package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.data.validation.Constraints;
import play.db.ebean.Model;

@Table(name="Customer")
@Entity
public class Customer extends Model{

	private static final long serialVersionUID = -8674002224744835877L;

	@Id
	@Constraints.Min(10)
	public Long id;

	@Constraints.Required
	public Long idCustomer;
	
	@Constraints.Required
	public String email;


	public static Finder<Long, Customer> find = new Finder<Long, Customer>(Long.class,
			Customer.class);

}
