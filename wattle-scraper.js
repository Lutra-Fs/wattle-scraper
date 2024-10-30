/**
 * Script for selectively downloading course materials from a web page.
 * This script allows users to list, select, and download items based on a custom filter.
 */

// Cache for storing download attempts
let downloadAttempts = new Map();

/**
 * Lists all items matching the filter and provides instructions for downloading.
 * @param {string} filter - The keyword to filter items (e.g., 'Lecture', 'Assignment')
 */
async function listAndDownloadItems(filter) {
    const items = document.querySelectorAll('.activity-item');
    const filteredItems = Array.from(items).filter(item => {
        const activityName = item.getAttribute('data-activityname');
        return activityName && activityName.toLowerCase().includes(filter.toLowerCase());
    });

    console.log(`Available ${filter} items:`);
    filteredItems.forEach((item, index) => {
        console.log(`${index + 1}. ${item.getAttribute('data-activityname')}`);
    });

    console.log("\nTo download, call downloadSelected(selection, filter)");
    console.log("selection can be:");
    console.log("  - Numbers and ranges: '1-3,5,7-9'");
    console.log("  - 'all' for all items");
    console.log("  - 'failed' to retry previously failed downloads");
    console.log(`Example: downloadSelected('1-3,5', '${filter}')`);
    console.log(`Example: downloadSelected('all', '${filter}')`);
}

/**
 * Parses the user's selection into an array of indices.
 * @param {string} selection - User's selection string
 * @param {number} maxIndex - Maximum valid index
 * @param {string} filter - The filter used for item selection
 * @returns {number[]} Array of selected indices
 */
function parseSelection(selection, maxIndex, filter) {
    if (selection.toLowerCase() === 'all') {
        return Array.from({length: maxIndex}, (_, i) => i);
    }
    if (selection.toLowerCase() === 'failed') {
        return Array.from(downloadAttempts.entries())
            .filter(([key, value]) => key.includes(filter) && value > 0)
            .map(([key]) => parseInt(key.split('-')[0]) - 1);
    }

    const indices = new Set();
    const parts = selection.split(',');

    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(num => parseInt(num.trim()) - 1);
            for (let i = start; i <= end; i++) {
                if (i >= 0 && i < maxIndex) indices.add(i);
            }
        } else {
            const index = parseInt(part.trim()) - 1;
            if (index >= 0 && index < maxIndex) indices.add(index);
        }
    }

    return Array.from(indices).sort((a, b) => a - b);
}

/**
 * Attempts to download selected items.
 * @param {string} selection - User's selection string
 * @param {string} filter - The filter used for item selection
 */
async function downloadSelected(selection, filter) {
    const items = document.querySelectorAll('.activity-item');
    
    let filteredItems;

    if (filter.toLowerCase() === 'pdf') {
        // 过滤出所有 PDF 文件
        filteredItems = Array.from(items).filter(item => {
            const resourcelinkdetails = item.querySelector('.resourcelinkdetails');
            return resourcelinkdetails && resourcelinkdetails.textContent.includes('PDF document');
        });
    } else {
        // 按照原有的方式过滤
        filteredItems = Array.from(items).filter(item => {
            const activityName = item.getAttribute('data-activityname');
            return activityName && activityName.toLowerCase().includes(filter.toLowerCase());
        });
    }

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const selectedIndices = parseSelection(selection, filteredItems.length, filter);
    const errorList = [];

    for (const index of selectedIndices) {
        const item = filteredItems[index];
        const activityName = item.getAttribute('data-activityname');
        const link = item.querySelector('.aalink.stretched-link');

        if (link) {
            try {
                let url;
                const onclickAttr = link.getAttribute('onclick');
                if (onclickAttr) {
                    const match = onclickAttr.match(/window\.open\('([^']+)'/);
                    if (match) {
                        url = new URL(match[1]);
                    } else {
                        url = new URL(link.href);
                    }
                } else {
                    url = new URL(link.href);
                }
                
                url.searchParams.set('redirect', '1');
                
                console.log(`Attempting to download: ${activityName}`);
                
                const a = document.createElement('a');
                a.href = url.toString();
                a.download = activityName.replace(/[/\\?%*:|"<>]/g, '-') + '.pdf';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                console.log(`Download initiated for: ${activityName}`);
                
                // Update cache
                downloadAttempts.set(`${index + 1}-${filter}`, 0);
                
                // Random delay between 5 to 10 seconds
                const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;
                await delay(randomDelay);
            } catch (error) {
                console.error(`Error downloading ${activityName}:`, error);
                errorList.push({ name: activityName, error: error.message });
                // Update cache for failed attempts
                downloadAttempts.set(`${index + 1}-${filter}`, (downloadAttempts.get(`${index + 1}-${filter}`) || 0) + 1);
            }
        } else {
            console.error(`No download link found for: ${activityName}`);
            errorList.push({ name: activityName, error: 'No download link found' });
            // Update cache for failed attempts
            downloadAttempts.set(`${index + 1}-${filter}`, (downloadAttempts.get(`${index + 1}-${filter}`) || 0) + 1);
        }
    }

    if (errorList.length > 0) {
        console.log("\nThe following items encountered errors:");
        errorList.forEach(item => {
            console.log(`- ${item.name}: ${item.error}`);
        });
        console.log("\nTo retry failed downloads, use: downloadSelected('failed', '${filter}')");
    } else {
        console.log("\nAll selected items were processed without errors.");
    }

    console.log("Download Finished");
}

// Instructions for usage
console.log("To start, call listAndDownloadItems(filter)");
console.log("Example: listAndDownloadItems('Lecture')");