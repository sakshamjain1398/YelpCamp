var mongoose=require("mongoose"),
	Campground=require("./models/campgrounds"),
	Comment=require("./models/comment")

var data=[
	{ 
		"name" : "Something",
		 "image" : "https://www.campamerica.co.uk/images/uploads/images/Private-Camp---Camp-Westmont-1400-x-610.png",
		 "description" : "Shank bresaola ham hock salami. Tri-tip tail bresaola doner beef frankfurter. Chuck alcatra jerky capicola. Tongue pig meatloaf, shank brisket corned beef beef beef ribs picanha pork loin."
	},
	{
		"name" : "Anything",
		"image" : "https://static1.squarespace.com/static/55ecd96fe4b0cee523072594/t/5734037a4c2f8582b5859ecd/1463026556921/FlashCamp_HR0075.jpg?format=1500w", 
		"description" : "Strip steak ball tip picanha biltong cow. Jowl short loin pastrami, pork chop leberkas fatback cow pork belly spare ribs prosciutto salami venison tail."
	},
	{
		"name" : "Anything else",
		"image" : "https://upload.wikimedia.org/wikipedia/commons/e/ef/Wilderness_Adventure_Camps.jpg"
	},
	{
		"name" : "Explorers",
		"image" : "http://explorersgroup.in/web/wp-content/uploads/2014/03/Rajmachi-Kids-Camp-560x300.jpg", 
		"description" : "Pork loin tail salami, cupim boudin burgdoggen jerky. Venison biltong turducken beef ribs flank, fatback pork belly pork chop ham shankle."
	}
];
function seedDB() {
	Campground.remove(function (err) {
	if(err)
		console.log(err)
		console.log("removed");
		data.forEach( function(seed) {
		Campground.create(seed,function (err,camp) {
			if(err)
				console.log(err);
			else
				{
					Comment.create({
						text:"blah blah blah blah!!!!",
						author:"Someone"
					}, function (err,comment) {
						if(err)
							console.log(err)
						else
							{
								camp.comments.push(comment);
								camp.save();
							}
					})
				}
		});
	});
});
	
}
module.exports=seedDB;