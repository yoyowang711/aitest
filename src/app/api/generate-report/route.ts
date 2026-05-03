import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { projectName, rawContent } = await request.json();

    if (!projectName || !rawContent) {
      return NextResponse.json({ error: "缺少参数" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com";

    if (!apiKey) {
      return NextResponse.json({ error: "未配置 API Key" }, { status: 500 });
    }

    const prompt = `你是一位资深 UI/UX 设计师。请将以下结构化的设计交付检查记录润色为一段自然、专业的"设计交付说明"，用于交给开发团队。

要求：
- 保留所有原始数据点，不增删内容
- 用段落形式表达，不要列表格式
- 语言专业但平实，不要过度包装
- 风险项用"建议关注"的语气表述

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
      console.error("OpenAI API error:", err);
      return NextResponse.json({ error: "AI 服务暂不可用" }, { status: 502 });
    }

    const data = await response.json();
    const polished = data.choices?.[0]?.message?.content ?? "";

    if (!polished) {
      return NextResponse.json({ error: "AI 返回为空" }, { status: 502 });
    }

    return NextResponse.json({ polished });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("generate-report error:", msg);
    return NextResponse.json({ error: `服务异常: ${msg}` }, { status: 500 });
  }
}
