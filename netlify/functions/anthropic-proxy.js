// Netlify Function: Anthropic API 프록시
// 브라우저는 이 함수만 호출하고, 진짜 API 키는 서버(Netlify 환경변수)에만 저장됩니다.

exports.handler = async function (event) {
  // CORS 프리플라이트 대응
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders(),
      body: JSON.stringify({ error: "POST 요청만 허용됩니다." }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        error: "서버에 ANTHROPIC_API_KEY 환경변수가 설정되어 있지 않습니다. Netlify 사이트 설정 > Environment variables에서 등록해주세요.",
      }),
    };
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: event.body,
    });

    const responseText = await response.text();

    return {
      statusCode: response.status,
      headers: corsHeaders(),
      body: responseText,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: `프록시 호출 중 오류: ${err.message}` }),
    };
  }
};

function corsHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
