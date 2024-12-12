import { promises as fs } from 'fs';

async function getDailyNews() {

    try {
        const response = await fetch("https://hn-ai-api.xeven.workers.dev/hn");
        const data = await response.json();
        if (!response.ok || response.status !== 200 || !data) {
            throw new Error("Failed to fetch data");
        }

        const filePath = ('dailyNews.json');

        await fs.writeFile(
            filePath,
            JSON.stringify(data, null, 2),
            'utf-8'
        );

        console.log(`Data saved to ${filename} at ${new Date().toISOString()}`);
    } catch (error) {
        console.error(error);
        return null;
    }
}

getDailyNews();