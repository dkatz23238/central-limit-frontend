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

  if (data.mean_of_sums > data.theoretical_mean_of_sums) {
    sumMeanElement.classList.remove("text-danger");
    sumMeanElement.classList.add("text-success");
  } else {
    sumMeanElement.classList.remove("text-success");
    sumMeanElement.classList.add("text-danger");
  }

  if (data.std_of_means > data.theoretical_std_of_means) {
    stdElement.classList.remove("text-danger");
    stdElement.classList.add("text-success");
  } else {
    stdElement.classList.remove("text-success");
    stdElement.classList.add("text-danger");
  }

  if (data.std_of_sums > data.theoretical_std_of_sums) {
    sumStdElement.classList.remove("text-danger");
    sumStdElement.classList.add("text-success");
  } else {
    sumStdElement.classList.remove("text-success");
    sumStdElement.classList.add("text-danger");
  }

  if (data.mean_of_means > data.theoretical_mean_of_means) {
    meanElement.classList.remove("text-danger");
    meanElement.classList.add("text-success");
  } else {
    meanElement.classList.remove("text-success");
    meanElement.classList.add("text-danger");
  }
}

function hideForms() {
  $("#gammaForm").hide();
  $("#gaussianForm").hide();
  $("#exponentialForm").hide();
  $("#loading").hide();
}

function allPossibleCases(arr) {
  if (arr.length == 1) {
    return arr[0];
  } else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1)); // recur with the rest of array
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        result.push(arr[0][j] + allCasesOfRest[i]);
      }
    }
    return result;
  }
}

async function handleRunExperiment() {
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
}

function handleSelect() {
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
}

function handleRunAnimation() {
  let selectElement = document.getElementById("distributionSelection");
  if (selectElement.value === "Select a distribution for Experiment") {
    alert("Please Select A Distribution To Continue.");
    return;
  }

  $("#loading").show();
  let sampleSize = $("#sampleSizeGroup").hide();
  let nSamples = $("#nSamplesGroup").hide();

  let i = 0;
  let n = 10;
  let m = 10;
  let selectedValue = selectElement.value;
  var sampleSizes = [];
  for (var k = 1; k <= 51; k = k + 5) {
    for (var j = 2; j <= 30; j = j + 20) {
      sampleSizes.push([k, j]);
    }
  }

  timer = setInterval(async function () {
    let newProgress = Math.round(1000 * (i / 20));
    $("#progressBar")
      .attr("aria-valuenow", newProgress)
      .css("width", newProgress);

    var now = +new Date();
    console.log(newProgress);
    i++;

    let nSamples = sampleSizes[i][0];
    let sampleSize = sampleSizes[i][1];
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

    console.log(data);
    renderPlots(data);
    renderStatistics(data);
    document.getElementById("sampleSizeWidget").innerHTML = "" + sampleSize;
    document.getElementById("nSamplesWidget").innerHTML = "" + nSamples;

    $("#loading").hide();

    n = n + 10;
    m = m + 10;
    if (i > 500) {
      clearInterval(timer);
    }
    // clear the timer at 400px to stop the animation
  }, 100);
}

const serverURL = "https://stats2server-c2iwk3zleq-ue.a.run.app";

$(document).ready(async function () {
  hideForms();
  $("#distributionSelection").change(handleSelect);
  $("#selectDistButton").click(handleRunExperiment);
  $("#runAnimationButton").click(handleRunAnimation);
});
