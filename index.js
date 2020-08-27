function renderPlots(data) {
  var trace0 = {
    x: data.simulation_means,
    type: "histogram",
    name: "Result",
  };

  var trace1 = {
    x: data.theoretical_sample_of_means,
    name: "Prediction",
    type: "histogram",
  };
  var data1 = [trace0, trace1];

  var layout1 = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
    title: "Medias de X",
    xaxis: { title: "Value" },
    yaxis: { title: "Count" },
    plot_bgcolor: "#222",
    paper_bgcolor: "#222",
  };

  var trace2 = {
    x: data.simulation_sums,
    type: "histogram",
    name: "Medias de X",
  };

  var trace3 = {
    x: data.theoretical_sample_of_sums,
    name: "Prediction",
    type: "histogram",
  };
  var data2 = [trace2, trace3];
  var layout2 = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
    title: "Sumas de X",
    xaxis: { title: "Value" },
    yaxis: { title: "Count" },
    plot_bgcolor: "#222",
    paper_bgcolor: "#222",
  };

  var trace4 = {
    x: data.trace,
    name: "Parent Distribution",
    type: "histogram",
  };

  var layout3 = {
    bargap: 0.05,
    bargroupgap: 0.2,
    barmode: "overlay",
    title: "Distribucion Original",
    xaxis: { title: "Value" },
    yaxis: { title: "Count" },
    plot_bgcolor: "#222",
    paper_bgcolor: "#222",
  };

  var data3 = [trace4];

  Plotly.newPlot("sumsDist", data1, layout1);
  Plotly.newPlot("meansDist", data2, layout2);
  Plotly.newPlot("traceDist", data3, layout3);
}

function renderStatistics(data) {
  let sumMeanElement = document.getElementById("sumMeanElement");
  let sumStdElement = document.getElementById("sumStdElement");
  let sumMeanElementPred = document.getElementById("sumMeanElementPred");
  let sumStdElementPred = document.getElementById("sumStdElementPred");

  let meanElement = document.getElementById("meanElement");
  let stdElement = document.getElementById("stdElement");
  let meanElementPred = document.getElementById("meanElementPred");
  let stdElementPred = document.getElementById("stdElementPred");

  meanElement.innerHTML = data.mean_of_means.toLocaleString("en-US");
  stdElement.innerHTML = data.std_of_means.toLocaleString("en-US");
  meanElementPred.innerHTML = data.theoretical_mean_of_means.toLocaleString(
    "en-US"
  );
  stdElementPred.innerHTML = data.theoretical_std_of_means.toLocaleString(
    "en-US"
  );
  sumMeanElement.innerHTML = data.mean_of_sums.toLocaleString("en-US");
  sumStdElement.innerHTML = data.std_of_sums.toLocaleString("en-US");
  sumMeanElementPred.innerHTML = data.theoretical_mean_of_sums.toLocaleString(
    "en-US"
  );
  sumStdElementPred.innerHTML = data.theoretical_std_of_sums.toLocaleString(
    "en-US"
  );
}

function hideForms() {
  $("#gammaForm").hide();
  $("#gaussianForm").hide();
  $("#exponentialForm").hide();
  $("#loading").hide();
}

const serverURL = "https://stats2server-c2iwk3zleq-ue.a.run.app";

$(document).ready(async function () {
  hideForms();

  $("#distributionSelection").change(function () {
    let selectElement = document.getElementById("distributionSelection");
    let selectedValue = selectElement.value;
    hideForms();
    switch (selectedValue) {
      case "gamma":
        $("#gammaForm").toggle();
        break;
      case "normal":
        $("#gaussianForm").toggle();
        break;
      case "exponential":
        $("#exponentialForm").toggle();
        break;
    }
  });

  $("#selectDistButton").click(async function () {
    $("#loading").show();
    let sampleSize = $("#sampleSize").val();
    let nSamples = $("#nSamples").val();

    document.getElementById("sampleSizeWidget").innerHTML = "" + sampleSize;
    document.getElementById("nSamplesWidget").innerHTML = "" + nSamples;

    console.log(`sampleSize ${sampleSize} nSamples ${nSamples}`);
    let selectElement = document.getElementById("distributionSelection");
    if (selectElement.value === "Select a distribution for Experiment") {
      alert("Please Select A Distribution To Continue.");
    }

    switch (selectElement.value) {
      case "gamma":
        let alpha = parseFloat($("#alpha").val());
        let theta = parseFloat($("#theta").val());
        var data = await fetch(
          `${serverURL}/gamma?alpha=${alpha}&theta=${theta}&n_samples=${nSamples}&sample_size=${sampleSize}`
        );
        data = await data.json();

        break;
      case "normal":
        let mu = parseFloat($("#mu").val());
        let sigma = parseFloat($("#sigma").val());
        var data = await fetch(
          `${serverURL}/normal?mu=${mu}&sigma=${sigma}&n_samples=${nSamples}&sample_size=${sampleSize}`
        );
        data = await data.json();

        break;
      case "exponential":
        let lambda = parseFloat($("#lambda").val());
        var data = await fetch(
          `${serverURL}/exponential?lambda=${lambda}&n_samples=${nSamples}&sample_size=${sampleSize}`
        );
        data = await data.json();

        break;
    }

    renderPlots(data);
    renderStatistics(data);
    $("#loading").hide();
  });
});
