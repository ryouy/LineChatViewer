import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `あなたは会話の要約を生成するアシスタントです。
以下のLINEトーク履歴を分析し、以下の形式で要約を出力してください。

## 会話のテーマ
（会話の主なテーマを1-2文で）

## 重要な出来事
（会話で言及された重要な出来事を箇条書きで）

## 結論
（会話の結論や決まったことなどを1-2文で）

日本語で出力してください。`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { messages } = body as { messages: { sender: string; text: string; time: string }[] };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages が必要です" },
        { status: 400 }
      );
    }

    const chatText = messages
      .map((m) => `[${m.time}] ${m.sender}: ${m.text}`)
      .join("\n");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`${SYSTEM_PROMPT}\n\n---\n\n${chatText}`);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json(
      { error: "要約の生成に失敗しました" },
      { status: 500 }
    );
  }
}
