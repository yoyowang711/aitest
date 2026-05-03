import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { projectName, rawContent } = await request.json();

    if (!projectName || !rawContent) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseUrl = "https://api.deepseek.com";

    if (!apiKey) {
      return NextResponse.json({ error: "未配置 API Key" }, { status: 500 });
    }

    const prompt = `你是一位资深 UI/UX 设计师。请将以下结构化的设计交付检查记录润色为一段自然、专业的"设计交付说明"。

要求：
- 保留所有原始数据点
- 不要列表
- 专业但清晰

项目名称：${projectName}

原始检查记录：
${rawContent}`;

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("DeepSeek API error:", err);
      return NextResponse.json({ error: "AI 服务暂不可用" }, { status: 502 });
    }

    const data = await response.json();
    const polished = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ polished });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: `服务异常: ${msg}` }, { status: 500 });
  }
}