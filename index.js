const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

const app = express();

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome, this is a webhook for Line Chatbot</h1>");
});

app.post("/webhook", (req, res) => {
  const agent = new WebhookClient({
    request: req,
    response: res,
  });

  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(req.body));

  function welcome(agent) {
    agent.add("ยินดีต้อนรับสู่ Line Chatbot!");
  }

  function fallback(agent) {
    agent.add("ขออภัย ฉันไม่เข้าใจที่คุณพูด");
    agent.add("กรุณาลองอีกครั้ง");
  }

  function rectangleArea(agent) {
    let width = agent.parameters.width || 0;
    let length = agent.parameters.length || 0;

    if (width > 0 && length > 0) {
      let area = (width * length).toFixed(2);
      let result = `พื้นที่ของสี่เหลี่ยมผืนผ้าที่กว้าง ${width} เซนติเมตร และยาว ${length} เซนติเมตร คือ ${area} ตารางเซนติเมตร.`;
      agent.add(result);
    } else {
      agent.add("กรุณาระบุความกว้างและความยาวที่เป็นค่าบวกเพื่อคำนวณพื้นที่สี่เหลี่ยมผืนผ้า");
    }
  }

  function triangleArea(agent) {
    let base = agent.parameters.base || 0;
    let height = agent.parameters.height || 0;

    if (base > 0 && height > 0) {
      let area = (0.5 * base * height).toFixed(2);
      let result = `พื้นที่ของสามเหลี่ยมที่ฐาน ${base} เซนติเมตร และสูง ${height} เซนติเมตร คือ ${area} ตารางเซนติเมตร.`;
      agent.add(result);
    } else {
      agent.add("กรุณาระบุฐานและความสูงที่เป็นค่าบวกเพื่อคำนวณพื้นที่สามเหลี่ยม");
    }
  }

  function circleArea(agent) {
    let radius = agent.parameters.radius || 0;

    if (radius > 0) {
      let area = (Math.PI * Math.pow(radius, 2)).toFixed(2);
      let result = `พื้นที่ของวงกลมที่มีรัศมี ${radius} เซนติเมตร คือ ${area} ตารางเซนติเมตร.`;
      agent.add(result);
    } else {
      agent.add("กรุณาระบุรัศมีที่เป็นค่าบวกเพื่อคำนวณพื้นที่วงกลม");
    }
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);
    let result = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      result = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มจะท้วมแล้วนะ";
    } else if (bmi >= 25.8 && bmi <= 29.9) {
      result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    //const flexMessage = {};

    //let payload = new Payload("LINE", flexMessage, { sendAsMessage: true });
    //agent.add(payload);

    agent.add(result);
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("area - rectangle - custom", rectangleArea);
  intentMap.set("area - rectangle - custom - yes", rectangleArea);
  intentMap.set("area - triangle - custom", triangleArea);
  intentMap.set("area - triangle - custom - yes", triangleArea);
  intentMap.set("area - circle - custom", circleArea);
  intentMap.set("area - circle - custom - yes", circleArea);
  intentMap.set("BMI - custom - yes", bodyMassIndex);

  agent.handleRequest(intentMap);
});

app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});
