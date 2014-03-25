function addToWishList() {
	console.log("testing2");
  var user = $("#customerId").val()
  var productId = $("#productId").val()
  var price = $("#wishPrice").val()
  console.log(user + productId + price);
  $.get("/wish/add?user="+user+"&productId="+productId+"&price="+price,function(data,status) {
	  console.log(status);
  },'html'); 
};

console.log("testing");