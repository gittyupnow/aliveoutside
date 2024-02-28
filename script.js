
	const queryString = window.location.search;		
  const urlParams = new URLSearchParams(queryString);
  const athlete_id = urlParams.get("athlete_id");
  window.history.replaceState(null,null,window.location.pathname);
  
  var data;

  //var angle = 180;

  if (athlete_id != null) {
		document.cookie = "athlete_id=" + athlete_id +";Max-Age=34646400"; //cookie expires 400days later
  }
    
  
  function getCookie(name) {
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
  }

	var ath_cookie = getCookie("athlete_id");
	console.log("THE ATHLETE ID in the cookie: " + ath_cookie);
 
 
  //probably want to switch these all to get todaysdate.UTCDate, UTCmonth, UTCyear and offset by the timezone the person is in
  var todaysdate = new Date();
  var year = todaysdate.getFullYear();
  var month = todaysdate.getMonth() + 1;
  var day = todaysdate.getDate();
  var lastdayofmonth = new Date(year, month, 0).getDate();
	var percentofmonth = ((day/lastdayofmonth)*100).toFixed(2);
 

  
	async function getData() {
  
  	const response = await fetch("https://hook.us1.make.com/2r34p8p18odnha6yprjo2jr8tu38jrt2?athlete_id=" + ath_cookie);
  	data = await response.json();
  
  	console.log(data);
  	//console.log(data["strava"][0].athlete.id); removed this because when it was on first day of month and no data yet for that day it wasn't returning the ID in the object.
  
  
    for (i=0; i<data["summary"].length; i++) {
    	var dayofmonth = i + 1;
      var exercisecount = 0;
      
      if (i<9) {
          dayofmonth = "0" + (dayofmonth).toString(); //making the day always 2 digits.. 01, 02, 03 etc..
      }

      $( ".test-dist" ).prepend("<div class='wrap day" + dayofmonth + "'></div>");
      
      //if there's no exercise yet, there won't be an entry in the strava data
    	for (j=0; j<data["strava"].length; j++) {
      
        if (dayofmonth == data["strava"][j].start_date_local.substr(8,2)) {
         	exercisecount++;
         
        $( ".wrap.day" + dayofmonth ).prepend(
						"<div class='activity-wrapper'>"
          + "<div class='walk-wrapper'>"
          + "<h1 class='walk-title'>" + data["strava"][j].name + "</h1>"
          + "<h1 class='walk-dist'>DISTANCE: " + (data["strava"][j].distance / 1000).toFixed(2) + " km</h1>"
          + "<h1 class='walk-dist'>ELEVATION GAIN: " + (data["strava"][j].total_elevation_gain).toFixed(2) + " m</h1>"
          + "<h1 class='walk-dist'>MOVING TIME: " + ((data["strava"][j].moving_time / 60).toFixed(2) | 0) + ":" + (((data["strava"][j].moving_time / 60)-((data["strava"][j].moving_time / 60).toFixed(2) | 0))*60).toFixed(0) + "</h1>"
          + "<a class='view-on-strava' target='_blank' href='https://www.strava.com/activities/" + data["strava"][j].id + "'>VIEW ON STRAVA</a>"//<div class='view-on-strava'></div>"
          + "<div class='info-block-inner-rad'></div>"
          + "</div>" //end walk-wrapper
          + "<img class='activity-img' src='https://temp-strava-test.sfo2.digitaloceanspaces.com/" + data["strava"][j].map.id + ".png'>"
          + "</div>" //end activity-wrapper
          );  
        }
      }
      


      if (exercisecount == 0) {
        if (i == data["summary"].length-1) {
	        //$( ".wrap.day" + dayofmonth ).prepend("<p class='theday'>NO EXERCISE YET</p>");

          $( ".wrap.day" + dayofmonth ).prepend(
						"<div class='activity-wrapper'>"
          + "<div class='no-exercise'>NO EXERCISE YET"
          + "<div class='top-left-inside-br'></div>"
          + "<div class='top-right-inside-br'></div>"
          + "</div>"  
          + "<img class='activity-img' src='https://uploads-ssl.webflow.com/653d32b96e7429d3232dc93e/6579e10d8b666a0754e97b25_no-exercise-temp.jpg'>"
          + "</div>" //end activity-wrapper
          );   
        }
	      else
  	    	$( ".wrap.day" + dayofmonth ).prepend("<p class='theday'>NO EXERCISE AT ALL - YOU FAIL</p>");
      }
      
      
      if ((i == data["summary"].length - 1) || (i == data["summary"].length - 2)) { //TODAY or YESTERDAY
        
        $( ".wrap.day" + dayofmonth ).prepend(
          "<div class='day-and-totals-wrapper'>"
        	+ "<div class='day-wrapper'>" + data["summary"][i].start_date_local + "</div>" 
          + "<div class='totals-wrapper'>"
          + "<div class='total-walk'>Walk - " + (data["summary"][i].day_total_distance_walk / 1000).toFixed(2) + "</div>"
          + "<div class='total-walk'>Ride - " + (data["summary"][i].day_total_distance_ride / 1000).toFixed(2) + "</div>"
          + "<div class='total-walk'>Run - " + (data["summary"][i].day_total_distance_run / 1000).toFixed(2) + "</div>"
          + "</div>" // end totals wrapper
          + "</div>" //day and totals wrapper
          );
          
          //START show-more hidden for today and yesterday
          $( ".wrap.day" + dayofmonth ).append(
          "<div class='show-more'>"
          + "<div class='show-more-border'></div>"
          + "<div class='show-more-top-right'></div>"
          + "<div class='show-more-top-right-inside'></div>"
          + "<div class='show-more-bottom-left'></div>"
          + "<div class='show-more-bottom-left-inside'></div>"
          + "<div class='show-more-plus-x'>+</div>"
          + "</div>" //end show-more
          ); 
          
          if (i == data["summary"].length - 1) {
            $( ".wrap.day" + dayofmonth + " .day-wrapper" ).prepend("<div class='today-or-yesterday'>today</div>");
            var todayactive = $( ".wrap.day" + dayofmonth ).children(".activity-wrapper").length;
            
            if (todayactive > 1) {
              for (k = 1; k<=todayactive; k++)
                $($( ".wrap.day" + dayofmonth + " .activity-wrapper" )[k]).addClass("show-more-hidden").css("display","none");

              $( ".wrap.day" + dayofmonth ).children(".show-more").css("display","block");
            }
          }

          if (i == data["summary"].length - 2) {
            $( ".wrap.day" + dayofmonth + " .day-wrapper" ).prepend("<div class='today-or-yesterday'>yesterday</div>");
            var yesterdayactive = $( ".wrap.day" + dayofmonth ).children(".activity-wrapper").length;
            
            if (yesterdayactive > 1) {
              for (l = 1; l<=yesterdayactive; l++)
                $($( ".wrap.day" + dayofmonth + " .activity-wrapper" )[l]).addClass("show-more-hidden").css("display","none");

              $( ".wrap.day" + dayofmonth ).children(".show-more").css("display","block");
            }
          }
          //END show-more hidden for today and yesterday
      }
      else { //Every other day
        $( ".wrap.day" + dayofmonth ).prepend(
          "<div class='day-and-totals-wrapper'>"
        	+	"<div class='day-wrapper'>" + data["summary"][i].start_date_local + "</div>"
          + "<div class='totals-wrapper'>"
          + "<div class='total-walk'>Walk - " + (data["summary"][i].day_total_distance_walk / 1000).toFixed(2) + "</div>"
          + "<div class='total-walk'>Ride - " + (data["summary"][i].day_total_distance_ride / 1000).toFixed(2) + "</div>"
          + "<div class='total-walk'>Run - " + (data["summary"][i].day_total_distance_run / 1000).toFixed(2) + "</div>"
          + "</div>" //end totals wrapper
          + "</div>" //end day and totals wrapper
          );        
      }
      
      
      if ( data["summary"][i]["day_total_distance_walk"] < data["minimum-walk-daily"] ) { //checks if daily goal was met and style accordingly
				 
         if (i == data["summary"].length - 1) { //TODAY
           $($( ".wrap.day" + dayofmonth + " .activity-wrapper" )[0]).append( //very first child only index 0
            "<div class='time-remaining-wrapper'>"
            + "<div class='time-remaining-title'></div>"
            + "<div class='bottom-left-inside-br'></div>"
            + "<div class='bottom-right-inside-br'></div>"
            + "</div>" //end time remaining wrapper
            );
        
            daycountdown();
            
           /*
            if (oncetoday == 1) { //only show on first activity
            $( ".wrap.day" + dayofmonth + " .poop").append("<div class='time-remaining-wrapper'><div class='time-remaining-title'></div><div class='bottom-left-inside-br'></div><div class='bottom-right-inside-br'></div></div>");
           daycountdown(); //only show the countdown if the daily goal hasn't been met
           oncetoday++;
            }
            */

	         $( ".wrap.day" + dayofmonth ).css("background-color", "var(--di-yellow)");   //if today, make the background color orange
           $( ".wrap.day" + dayofmonth + " .walk-wrapper").css("background-image", "linear-gradient(to right, var(--di-yellow), rgba(255, 255, 255, 0))");      	
           $( ".wrap.day" + dayofmonth + " .info-block-inner-rad").css("color", "var(--di-yellow)");
           $( ".wrap.day" + dayofmonth + " .show-more .show-more-border").css("border-color","var(--di-yellow)");
           $( ".wrap.day" + dayofmonth + " .show-more-top-right-inside").css("color","var(--di-yellow)");
           $( ".wrap.day" + dayofmonth + " .show-more-bottom-left-inside").css("color","var(--di-yellow)");
           } //END TODAY
         
         else { //Every other day
           $( ".wrap.day" + dayofmonth ).css("background-color", "var(--di-red)");      	
           $( ".wrap.day" + dayofmonth + " .walk-wrapper").css("background-image", "linear-gradient(to right, var(--di-red), rgba(255, 255, 255, 0))");      	
           $( ".wrap.day" + dayofmonth + " .info-block-inner-rad").css("color", "var(--di-red)");
           $( ".wrap.day" + dayofmonth + " .show-more .show-more-border").css("border-color","var(--di-red)");
           $( ".wrap.day" + dayofmonth + " .show-more-top-right-inside").css("color","var(--di-red)");
           $( ".wrap.day" + dayofmonth + " .show-more-bottom-left-inside").css("color","var(--di-red)");
         }
      }

      
    } //END BIG ITERATION WRAPPER
    

    
    console.log("year month day: " + year + " " + month + " " + day);
    console.log("PERCENTAGE OF MONTH: " + percentofmonth);
    
    $(".progress-callout").text("DAY " + day + "/" + lastdayofmonth);
    $(".progress-callout").css("opacity", "100");
    $(".progress-bar").css("width", percentofmonth + "%");
    
    $( '.show-more' ).on( 'click', function() {
      $(this).siblings('.activity-wrapper.show-more-hidden').toggle( "fast", function() {
           // Animation complete.
           
          // $($(this).siblings('.show-more')).css("rotate", angle +"deg");
           //angle = angle + 180;
      });
      //$(this).css("rotate","32deg");
    });

	}  

getData();


/////--------------------------------------------------------------------------
///// make one function with a single date object.. not need to have 3.
/////--------------------------------------------------------------------------


function seconds() {  
  var currsec = 60 - new Date().getSeconds();

  if (currsec < 10)
  	return ("0" + currsec);
  if (currsec == 60)
  	return ("00");       
  else
  	return currsec;
}

function minutes() {  
  var currmin = 60 - new Date().getMinutes();
  
  if (currmin < 10)
  	return ("0" + currmin);
  if (currmin == 60)
  	return ("00");    
  else
  	return currmin;
}


function hours() {  
  var currhour = 24 - new Date().getHours() - 1;
  
  if (currhour == -1 || currhour == 0)
  	return ("00");
  else
  	return currhour;
}


function daycountdown() {
	setInterval(() => $(".time-remaining-title").text("TIME REMAINING TO MEET DAILY GOAL: " + hours() +":"+ minutes() + ":" + seconds()), 1000);
  
//this below is just a proof of concept.. redo it and combine it with the above.. need to convert hours and minutes to degrees.. keep the white one 15 degrees ahead just so it's a nice gradient.
//combine using this syntax https://www.programiz.com/javascript/setInterval
/*
setInterval(() => $(".conic-tester").css("background", "conic-gradient( #d86161 " + seconds()/60*360 + "deg, white " + (((seconds())/60*360)+2.25) + "deg)"), 1000);  

setInterval(() => $(".conic-hours-minutes").css("background", "conic-gradient( green " + ((hours() + (minutes())/60)/24)*360 + "deg, white " + ((((hours() + (minutes())/60)/24)*360)+2.25) + "deg)"), 1000);  

setInterval(() => $(".cir-wrapper").css("rotate", (seconds()/60*360) + "deg"), 1000);
*/

/* WIP testing of conic gradient without setinterval.. don't delete yet
$(".conic-tester").css("background", "conic-gradient( #d86161 " + (45/60*360) + "deg, white " + (((45)/60*360)+2.25) + "deg)"); 
$(".conic-hours-minutes").css("background", "conic-gradient( green " + 72 + "deg, white " + (72+2.25) + "deg)");  
$(".cir-wrapper").css("rotate", (45/60*360) + "deg");
*/
}

/////--------------------------------------------------------------------------
///// END make one function with a single date object.. not need to have 3.
/////--------------------------------------------------------------------------
