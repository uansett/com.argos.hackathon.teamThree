package controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import models.Customer;
import models.WishlistItem;
import play.mvc.Controller;
import play.mvc.Result;


public class Application extends Controller {


	public static Result admin(){
		return ok(views.html.admin.render());
	}
	
	public static Result index(final int customerId) throws Exception{
		String s = readFile("public/resouces/start.html", StandardCharsets.UTF_8);
		String e = readFile("public/resouces/end.html", StandardCharsets.UTF_8);
		return ok(views.html.wish.render(customerId,s,e)).as("text/html");
	}

	public static Result addWish(final long customerId, final long productId,
			final double price) throws Exception{
		System.out.println("testing");
		(new WishlistItem(customerId, productId, price)).save();

		return ok();
		
	}
	
	public static Result changePrice(final long productId, final double price){
		List<WishlistItem> list = WishlistItem.find.where()
				.gt("price_offered", price).findList();
		
		if(list.isEmpty()) return ok();
		
		List<Long> customerIds = new ArrayList<Long>();
		for(WishlistItem i : list){
			customerIds.add(i.idCustomer);
		}
		//List<Customer> customers = Customer.find.all();
		List<Customer> customers = Customer.find.where().in("id_customer", customerIds).findList();
		
		//Create url
		StringBuffer sB = new StringBuffer();
		sB.append("http://roblivermore.co.uk/SendWishEmail.aspx?");
		for(Customer c : customers){
			sB.append("address=");
			sB.append(c.email);
			sB.append("&");
		}
		return ok(getHTML(sB.toString()));
	}
	
	public static String getHTML(String urlToRead) {
	      URL url;
	      HttpURLConnection conn;
	      BufferedReader rd;
	      String line;
	      String result = "";
	      try {
	         url = new URL(urlToRead);
	         conn = (HttpURLConnection) url.openConnection();
	         conn.setRequestMethod("GET");
	         rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
	         while ((line = rd.readLine()) != null) {
	            result += line;
	         }
	         rd.close();
	      } catch (IOException e) {
	         e.printStackTrace();
	      } catch (Exception e) {
	         e.printStackTrace();
	      }
	      return result;
	   }


	private static String readFile(String path, Charset encoding)
			throws IOException {
		byte[] encoded = Files.readAllBytes(Paths.get(path));
		return encoding.decode(ByteBuffer.wrap(encoded)).toString();
	}

}
