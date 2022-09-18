let movies = [
    {title : "Inception", imageUrl: "add image url"},
    {title : "Sons of Anarchy", imageUrl: "add image url"}
  ];

  function myFunction() {
    let result = "";
    movies.forEach(function (item) {
      result += "<div class='swiper-slide'><img src='"+ item.imageUrl +"' alt='alt text'> " + item.title + " ";
    });
    
    document.getElementById("listMovies").innerHTML = result;
  }
  
  myFunction();