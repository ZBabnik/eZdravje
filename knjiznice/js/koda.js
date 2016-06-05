
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
 
 // GOOD
 function klicGen()
 {
 	for(var i = 1; i < 4; i++) {
 		generirajPodatke(i);	
 	}
 }
 
 // GOOD
 function generirajPodatke(stPacienta) {
       
    ehrId1 = "1ec0baeb-75e0-41d1-86fa-41c782dbfcad";
    ehrId2 = "af9a0cc2-9ba1-44ec-8c60-2ed901c10f69";
    ehrId3 = "170e15d4-d324-4de3-9aeb-8aec0cbfc875";
    
    if(stPacienta == 1) {
    	$("#preberiEhrIdZaVitalneZnake").append("<option value="+ehrId1+">Lena Lenoba</option>");
    }
    if(stPacienta == 2) {
    	$("#preberiEhrIdZaVitalneZnake").append("<option value="+ehrId2+">Povprečko Povprečnež</option>");
    }
    if(stPacienta == 2) {
    	$("#preberiEhrIdZaVitalneZnake").append("<option value="+ehrId3+">Suhi Suhec</option>");
    }
}

//GOOD
$(document).ready(function() {
		
		$('#preberiEhrIdZaVitalneZnake').change(function() {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("");
		//$("#rezultatMeritveVitalnihZnakov").html("");
		$("#meritveVitalnihZnakovEHRid").val($(this).val());
		
	});	
})

function drawBackgroundColor() {
	
    var data = google.visualization.arrayToDataTable
    ([
    	['X', 'BMI(18)', 'BMI(25)'],
        ['0',  0,  0],
        ['20', 0.72, 1],
        ['40', 3, 4],
        ['60', 6.5, 9],
        ['80', 11, 16],
        ['100',  18,   25],
        ['120', 26, 36],
        ['140', 35, 49],
        ['160', 46, 64],
        ['180', 58, 81],
        ['200',  72,  100],
    ]);
      
	var options = {
        hAxis: {
        	title: 'Visina'
    	},
        vAxis: {
        	title: 'Teza'
        },
        backgroundColor: '#f1f8e9',
        colors: ['black', 'blue']
        };
    
    var chart = new google.visualization.LineChart(document.getElementById('rezultatMeritveVitalnihZnakov'));
    chart.draw(data, options);
}

// GOOD
function mapOdlocitev() {
	var bmi = teza_global/Math.pow((visina_global/100), 2);
	console.log(bmi);
	
	if (bmi < 26 && bmi > 18) {
		izrisiGood();
	}
	else {
		izrisiBad();
	}
}

// GOOD
function izrisiBad() {
	document.getElementById('map').style.display = 'block';
	$("#predlogBMI").append("<div><b>Predlagamo obisk zdravstvenega doma</b></div>");
	initMap({lat: 46.0562965, lng: 14.5150674});
}

// GOOD
function izrisiGood() {
	document.getElementById('map').style.display = 'block';
	$("#predlogBMI").append("<div><b>Zdravi ste - predlagamo obisk Doner Kebab :D</b></div>");
	initMap({lat: 46.0546795, lng: 14.5303904});
}


// GOOD
function initMap(global) {
	
	// Create a map object and specify the DOM element for display.
	var map = new google.maps.Map(document.getElementById('map'), {
	  center: global,
	  scrollwheel: true,
	  zoom: 15
	});
	
	// Create a marker and set its position.
	var marker = new google.maps.Marker({
	  map: map,
	  position: global,
	  title: 'eZdravje!'
	});
}

// GOOD
function pocistiPodatke() {
	$("#imeInPriimekUporabnika").empty();
	$("#rezultatMeritveVitalnihZnakovBasic").empty();
	//$("#rezultatMeritveVitalnihZnakov").empty();
	document.getElementById('map').style.display = 'none';
	$("#map").empty();
	$("#podrobnosti").empty();
	$("#predlogBMI").empty();
	//drawBackgroundColor();
}

//GOOD
function preberiMeritveVitalnihZnakov() {
	
	var sessionId = getSessionId();
	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	ehrIDohgod = ehrId;
	var results;
	var teza;
	var visina;

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				partyDataohgod = data.party;
				//$("#rezultatMeritveVitalnihZnakovBasic").html("<div class='row'><div class='col-lg-8 col-md-8 col-sm-8'><h4>BMI uporabnika "+ party.firstNames +" "+ party.lastNames+" je </h4>");
					results = "<div class='row>'<div class='col-lg-10 col-md-10 col-sm-10'>";
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	results += "  <b>Telesna teža:</b> ";
                    			teza = res[0].weight;
                    			teza_global = res[0].weight;
						        results += res[0].weight + " " +res[0].unit;
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "height",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    		visina = res[0].height;
					    		visina_global = res[0].height;
					    		results += "   <b>Telesna višina:</b> ";
						        results += res[0].height +" "+res[0].unit;
								results += "</div></div>";
								$("#imeInPriimekUporabnika").append("<div class='row'><div class='col-lg-8 col-md-8 col-sm-8'><h4>UPORABNIK: <b>"+ party.firstNames +" "+ party.lastNames+
									"<br></b> BMI: <b>"+ Math.ceil(teza/Math.pow((visina/100), 2))+"</b></h4><h6>Če se izpiše rezultat NaN prosim poskusite ponovno izračunati BMI!</h6></div>");
        		    			$('#rezultatMeritveVitalnihZnakovBasic').append("<button type='button' class='btn btn-primary btn-xs' onclick='izpisiTezoVisino()'>Podrobnosti</button></div><button type='button' class='btn btn-primary btn-xs' onclick='mapOdlocitev()'>Predlagaj rešitev</button>");
        		    			google.charts.load('current', {packages: ['corechart']});
								google.charts.setOnLoadCallback(drawBackgroundColor);
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
			}
		});
	}
}

//GOOD
var teza_global;
var visina_global;
var bmi_global;

function zbrisiTezoVisino() {
	$('#rezultatMeritveVitalnihZnakovBasic').empty();
	$('#rezultatMeritveVitalnihZnakovBasic').append("<button type='button' class='btn btn-primary btn-xs' onclick='izpisiTezoVisino()'>Podrobnosti</button></div><button type='button' class='btn btn-primary btn-xs' onclick='mapOdlocitev()'>Predlagaj rešitev</button>");
	$("#podrobnosti").empty();	
}

//GOOD
function izpisiTezoVisino() {

	var sessionId = getSessionId();
	var ehrId = ehrIDohgod;
	var results;
	var teza;
	var visina;
	
					$("#podrobnosti").empty();
					results = "<div class='row>'<div class='col-lg-10 col-md-10 col-sm-10'>";
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
						    	results += "  <b>Telesna teža:</b> ";
                    			teza = res[0].weight;
                    			teza_global = res[0].weight;
						        results += res[0].weight + " " +res[0].unit;
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "height",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    		visina = res[0].height;
					    		visina_global = res[0].height;
					    		results += "   <b>Telesna višina:</b> ";
						        results += res[0].height +" "+res[0].unit;
						        //results += "   <b>BMI:</b> "+ (teza/Math.pow((visina/100), 2));
								results += "</div></div>";
								$('#rezultatMeritveVitalnihZnakovBasic').empty();
								$('#rezultatMeritveVitalnihZnakovBasic').append("<button type='button' class='btn btn-primary btn-xs' onclick='zbrisiTezoVisino()'>Podrobnosti</button></div><button type='button' class='btn btn-primary btn-xs' onclick='mapOdlocitev()'>Predlagaj rešitev</button>");
						        $("#podrobnosti").append(results);
					    	} else {
					    		$("#preberiMeritveVitalnihZnakovSporocilo").html(
                    "<span class='obvestilo label label-warning fade-in'>" +
                    "Ni podatkov!</span>");
					    	}
					    },
					    error: function() {
					    	$("#preberiMeritveVitalnihZnakovSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
}

// GOOD
function kreirajEHRzaBolnika() {
	sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var spol = $("#kreirajSpol").val();
	
	if(spol != "FEMALE" || spol != "MALE") {
		spol = "MALE";
	}
	
	if (!ime || !priimek || !spol || ime.trim().length == 0 ||
      priimek.trim().length == 0 || spol.trim().length == 0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            gender: spol,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreirajSporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
}

// GOOD
function dodajMeritveVitalnihZnakov() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveVitalnihZnakovSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
