package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import play.data.validation.Constraints;
import play.db.ebean.Model;

@Table(name="WishlistItem")
@Entity
public class WishlistItem extends Model{
	
	private static final long serialVersionUID = 3672099883331506032L;

	@Id
	@Constraints.Min(10)
	public Long id;

	@Constraints.Required
	@ManyToOne
	@JoinColumn(name = "Customer", referencedColumnName = "idCustomer")
	public Long idCustomer;
	
	@Constraints.Required
	public Long idProduct;
	
	@Constraints.Required
	public boolean promoNotification = true;
	
	public Double priceOffered;

	public WishlistItem(final long customerId, final long productId, final double priceOffered){
		this.idCustomer = customerId;
		this.idProduct = productId;
		this.priceOffered = priceOffered;
	}

	public static Finder<Long, WishlistItem> find = new Finder<Long, WishlistItem>(Long.class,
			WishlistItem.class);

}
