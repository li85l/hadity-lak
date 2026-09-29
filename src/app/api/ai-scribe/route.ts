import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, tone = "رومانسي", sender = "أحمد", recipient = "سارة" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Tone variations
    let rewrittenText = "";
    switch (tone) {
      case "شاعري":
        rewrittenText = `إلى ${recipient}، نبض الفؤاد وسكون الروح...\n\n${prompt}\n\nأنتِ القصيدة التي لم يكتبها شاعر، واللحن الذي تراقصت على أنغامه كل أيامي. دمتِ لقلبي قمراً لا يغيب أبداً. ❤️`;
        break;
      case "عميق":
        rewrittenText = `يا ${recipient}...\n\n${prompt}\n\nفي هذا العالم الواسع والمزدحم، كان وجودكِ بجانبي هو الشيء الوحيد الحقيقي واليقين الراسخ الذي لا يتزعزع. معكِ أدركتُ أن الحب ليس مجرد شعور، بل أمان وسكينة وسفرٌ لا ينتهي نحو النور. ❤️`;
        break;
      case "لطيف":
        rewrittenText = `حبيبتي ${recipient} الغالية ✨\n\n${prompt}\n\nأحب ضحكتكِ، وأحب كل التفاصيل الصغيرة التي تخصك، وكل يوم معك هو يوم سعيد يستحق أن يُحتفل به! شكراً لأنكِ دائماً تملئين قلبي فرحاً ❤️`;
        break;
      case "مختصر":
        rewrittenText = `${prompt}\n\nأنتِ كل ما تمنيت، وكل ما أحتاج. أحبكِ جداً يا ${recipient} ❤️`;
        break;
      case "عاطفي":
      case "رومانسي":
      default:
        rewrittenText = `إلى أغلى ما أملك في هذا الوجود، ${recipient} الغالية ❤️\n\n${prompt}\n\nمنذ أن عرفتكِ، أصبح لكل شيء معنى أجمل، ولكل لحظة طعم السعادة. شكراً لأنكِ وطني وملاذي وسندي، أحبكِ أكثر مما تسع الكلمات. ❤️`;
        break;
    }

    return NextResponse.json({ text: rewrittenText });
  } catch (error) {
    console.error("AI Scribe error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
