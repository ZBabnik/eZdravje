
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
 function generirajPodatke(stPacienta) {
       
    ehrId = "";

  // TODO: Potrebno implementirati
  

  return ehrId;
}

function kreirajEHRzaBolnika() {
	var sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var spol = $("#kreirajSpol").val();
	
    if(spol != "MALE" || spol != "FEMALE") {
       spol = "MALE";
    }
	if (!ime || !priimek || ime.trim().length == 0 ||
      priimek.trim().length == 0) {
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

function dodajMeritveVitalnihZnakov() {
	var sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();
	
	console.log(telesnaTeza);
	
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
              "<span class='obvestilo label label-success fade-in'>Podatki uspesno poslani.</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveVitalnihZnakovSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}

var ehrIDohgod;
var partyDataohgod;

function preberiMeritveVitalnihZnakov() {
	
	var sessionId = getSessionId();
	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	var results;
	var teza;
	var visina;
	ehrIDohgod = ehrId;

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
				$("#rezultatMeritveVitalnihZnakovBasic").append("<div class='row'><div class='col-lg-8 col-md-8 col-sm-8'><h4>Ime: "+ party.firstNames +" Priimek: "+ party.lastNames+" ehrId :"+ ehrId +"<h4></div> "+
        		"</div><button type='button' class='btn btn-primary btn-xs' onclick='izpisiTezoVisino()'>+</button>");
			}
		});
	}
}

var teza_global;
var visina_global;

function izpisiTezoVisino() {

	var sessionId = getSessionId();
	var ehrId = ehrIDohgod;
	var results;
	var teza;
	var visina;
	
					$("#rezultatMeritveVitalnihZnakov").empty();
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
						        results += "   <b>BMI:</b> "+ (teza/Math.pow((visina/100), 2));
								results += "</div></div>";
						        $("#rezultatMeritveVitalnihZnakov").append(results);
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


function makeGraph() {

	var margin = {top: 20, right: 20, bottom: 30, left: 50}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

	var svg = d3.select('#rezultatMeritveVitalnihZnakov')
				.append('svg')
				.attr({
						"width" : width + margin.right + margin.left, 
						"height": height + margin.top + margin.bottom
					})
					.append('g')
						.attr("transform", "translate(" + margin.left + ',' + margin.right + ")");

	var x = d3.scale.linear().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	var line = d3.svg.line()
						.x(function(d) { return x(d.teza)})
						.y(function(d) { return y(d.visina)});
						
	//Tommorow
	
	d3.cvs("bmi.csv", function(napaka, data){
		if(napaka) console.log("ERR");
		data.forEach(function(d) {
			d.weight = +d.weight;
			d.height = +d.height;
		})
		
		xScale.domain(data.map(function(d) {
			return d.height;
		}))
		
		yScale.domain(data.map(function(d) {
			return d.weight;
		}))
	})
	
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
