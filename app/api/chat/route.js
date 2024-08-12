import {NextResponse} from 'next/server';
import OpenAI from 'openai';

const systemPrompt = "Welcome to HeadStarterAI's Customer Support! I’m here to assist you with any questions or issues related to our AI-powered interview platform designed specifically for software engineering jobs. Here’s how I can help:\
General Information: Learn about HeadStarterAI's features, benefits, and how our platform can enhance your job application process.\
Account Assistance: Get help with creating, managing, or troubleshooting your account. This includes login issues, profile updates, and subscription information.\
Interview Preparation: Find tips and resources to prepare for your AI-powered interviews, including how to navigate the interview process and what to expect.\
Technical Support: Address any technical problems you might encounter with our platform, such as system errors, connectivity issues, or interface glitches.\
Feedback and Suggestions: Provide feedback on your experience or suggest features you’d like to see.\
Feel free to ask me anything or type “Help” to see a list of options. If I can’t assist you directly, I'll guide you to the appropriate resources or connect you with a human representative. How can I assist you today?"

export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.json();
    const completion = await openai.complete({ 
        messages: 
        [
            { role: 'system', content: systemPrompt }, ...data,
        ],
        model: 'gpt-3.5-turbo',
        stream: true,
    });
    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const message of completion) {
                    const content = message.choices[0]?.delta?.content;
                    if (content) {
                        controller.enqueue(encoder.encode(content));
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                controller.close();
            }
        }
    })
    
    return new NextResponse(stream);
}