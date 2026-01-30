
const { createClient } = require('../web/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://fpibemvovdkddcamejbq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaWJlbXZvdmRrZGRjYW1lamJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzYxODYsImV4cCI6MjA4NTE1MjE4Nn0.rLvvRNEGyLr_gIm4L8Yx6XPzTDTyFgVlT0tPdKX-nDE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function uploadApk() {
    // Point to DEBUG APK
    const filePath = path.resolve(__dirname, '../mobile/build/app/outputs/flutter-apk/app-debug.apk');

    if (!fs.existsSync(filePath)) {
        console.error('APK file not found at:', filePath);
        return;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'app-debug.apk';
    const bucketName = 'downloads';

    console.log(`Uploading ${fileName} (Universal, ~60MB) to bucket '${bucketName}'...`);
    console.log('NOTE: This requires the PUBLIC bucket policy to be set.');

    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
            contentType: 'application/vnd.android.package-archive',
            upsert: true
        });

    if (error) {
        console.error('Upload Error:', error.message);
        if (error.message.includes('bucket not found') || error.message.includes('row-level security')) {
            console.log('\n--- DIAGNOSIS ---');
            console.log('Supabase Blocked the Upload (Security Policy).');
            console.log('Action: User must add "INSERT/UPDATE/SELECT" policy for "anon" role in bucket "downloads".');
        }
    } else {
        console.log('Upload Success!', data);

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);

        console.log('\nPERMANENT UNIVERSAL URL:', publicUrl);
    }
}

uploadApk();
