package com.brightcove.playvideos;

import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.MediaController;

import com.brightcove.player.media.Catalog;
import com.brightcove.player.media.PlaylistListener;
import com.brightcove.player.model.Playlist;
import com.brightcove.player.view.BrightcoveVideoView;


public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final BrightcoveVideoView brightcoveVideoView = (BrightcoveVideoView) findViewById(R.id.brightcove_video_view);
        Catalog catalog = new Catalog("XGuquNMCweRY0D3tt_VUotzuyIASMAzhUS4F8ZIWa_e0cYlKpA4WtQ..");

        MediaController controller = new MediaController(this);
        brightcoveVideoView.setMediaController(controller);

        catalog.findPlaylistByID("2764931905001", new PlaylistListener() {
          @Override
          public void onPlaylist(Playlist playlist) {
            brightcoveVideoView.addAll(playlist.getVideos());
            brightcoveVideoView.start();
          }

          @Override
          public void onError(String s) {
            throw new RuntimeException(s);
          }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

}
