import { promises as fs } from 'fs';
import { Buffer } from 'buffer';

function generateImgPrompt(headline) {
    return `poster style image for new headline: ${headline} , vintage style, with a touch of modernism,8k detailed, realistic`;
}

async function getDailyNews() {

    try {
        console.time('getDailyNews');
        const response = await fetch("https://hn-ai-api.xeven.workers.dev/hn");
        const data = await response.json();
        if (!response.ok || response.status !== 200 || !data) {
            console.error('Failed to fetch data:', {
                response
            });
            throw new Error("Failed to fetch data");
        }
        console.log('Fetched news data:', data);

        const imagePromises = data.slice(0, 3).map(async (item, index) => {
            const imgResponse = await fetch(
                `https://ai-image-api.xeven.workers.dev/img?prompt=${generateImgPrompt(item.aiHeadline)}&model=flux-schnell`
            );
            const buffer = await imgResponse.arrayBuffer();
            return {
                buffer: Buffer.from(buffer),
                index: index + 1
            };
        });
        console.log('Fetched images for news data');

        await fs.writeFile(
            'dailyNews.json',
            JSON.stringify(data, null, 2),
            'utf-8'
        );

        // Save all images in parallel
        const images = await Promise.all(imagePromises);
        await Promise.all(images.map(img =>
            fs.writeFile(
                `./src/assets/image${img.index}.jpeg`,
                img.buffer
            )
        ));

        console.log('Successfully saved news data and images');

    } catch (error) {
        console.error('Error:', error);
        throw error;
    } finally {
        console.timeEnd('getDailyNews');
    }
}

getDailyNews();