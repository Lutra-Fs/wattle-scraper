# Wattle Course Material Downloader

A browser-based JavaScript tool for selectively downloading course materials from Wattle (ANU's Moodle-based learning management system).

## Features

- 🔍 Filter materials by type (e.g., lectures, assignments, PDFs)
- 📑 List available downloadable items
- ✅ Select specific items or ranges for download
- 🔄 Retry mechanism for failed downloads
- ⏱️ Smart delay between downloads to prevent timeouts
- 📝 Detailed console logging for download status

## Usage

### Step 1: Setup

1. Open your Wattle course page in a web browser
2. Open the browser's Developer Tools (F12 or Right Click → Inspect)
3. Navigate to the Console tab
4. Copy and paste the entire script into the console

### Step 2: List Available Items

To see what items are available for download, use the `listAndDownloadItems()` function with a filter:

```javascript
// List all lecture materials
listAndDownloadItems('Lecture')

// List all assignment materials
listAndDownloadItems('Assignment')

// List all PDF documents
listAndDownloadItems('pdf')
```

### Step 3: Download Items

After listing items, use `downloadSelected()` to start downloading. You have several options for selection:

```javascript
// Download specific items (e.g., items 1, 2, 3, and 5)
downloadSelected('1-3,5', 'Lecture')

// Download all items matching the filter
downloadSelected('all', 'Lecture')

// Retry previously failed downloads
downloadSelected('failed', 'Lecture')
```

## Selection Format

- Individual items: `'1,3,5'`
- Ranges: `'1-5'`
- Combination: `'1-3,5,7-9'`
- All items: `'all'`
- Failed items: `'failed'`

## Features in Detail

### Smart Download Management
- Automatically handles different types of course materials
- Cleans filenames to ensure compatibility
- Adds appropriate file extensions

### Error Handling
- Tracks failed downloads for retry
- Provides detailed error messages
- Allows selective retry of failed downloads

### Rate Limiting
- Implements random delays (5-10 seconds) between downloads
- Prevents server overload and blocking

## Notes

- This script is designed for use with Wattle (ANU's Moodle variant)
- Downloads are handled through the browser's download manager
- File names are automatically sanitized to remove invalid characters

## Troubleshooting

If you encounter issues:

1. Ensure you're logged into Wattle
2. Check if the console shows any error messages
3. Try using the 'failed' option to retry failed downloads
4. Verify that your browser allows multiple downloads
5. Check your browser's download settings

## Disclaimer

This tool is for personal use to help students organize their course materials. Use responsibly and in accordance with ANU's policies regarding course material downloads.

## Contributing

Feel free to submit issues and enhancement requests through the repository's issue tracker.

## License

This project is licensed under the GNU General Public License v3.0 (GPLv3). This means:

### What you can do:
- ✅ Use the software for any purpose
- ✅ Study how the software works and modify it
- ✅ Redistribute copies of the original software
- ✅ Distribute your modified versions of the software

### What you must do:
- 📢 License any derivatives under GPLv3
- 📝 State significant changes made to the software
- 📋 Include original copyright and license notices
- 📦 Make source code available when distributing
- ⚠️ Include a copy of the full license text

For the full license text, see [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)
