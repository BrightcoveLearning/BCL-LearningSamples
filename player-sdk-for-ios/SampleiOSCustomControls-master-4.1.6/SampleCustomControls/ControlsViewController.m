//
//  ControlsViewController.m
//  SampleCustomControls
//
// Copyright (c) 2014 Brightcove, Inc. All rights reserved.
// License: https://accounts.brightcove.com/en/terms-and-conditions
//

#import "ControlsViewController.h"

#import "RACEXTScope.h"


@interface ControlsViewController ()

@property (nonatomic, weak) AVPlayer *currentPlayer;

@property (nonatomic, weak) IBOutlet UIButton *playPauseButton;
@property (nonatomic, weak) IBOutlet UILabel *elapsedTimeLabel;
@property (nonatomic, weak) IBOutlet UISlider *progressSlider;
@property (nonatomic, weak) IBOutlet UILabel *durationLabel;

@property (nonatomic, assign) BOOL wasPlayingOnSeek;

@end


@implementation ControlsViewController

#pragma mark BCOVDelegatingSessionConsumerDelegate

- (void)playbackConsumer:(id<BCOVPlaybackSessionConsumer>)consumer didAdvanceToPlaybackSession:(id<BCOVPlaybackSession>)session
{
    self.currentPlayer = session.player;
    self.wasPlayingOnSeek = NO;
    self.elapsedTimeLabel.text = [ControlsViewController formatTime:0];
    self.progressSlider.value = 0.f;
}

- (void)playbackConsumer:(id<BCOVPlaybackSessionConsumer>)consumer playbackSession:(id<BCOVPlaybackSession>)session didChangeDuration:(NSTimeInterval)duration
{
    self.durationLabel.text = [ControlsViewController formatTime:duration];
}

- (void)playbackConsumer:(id<BCOVPlaybackSessionConsumer>)consumer playbackSession:(id<BCOVPlaybackSession>)session didProgressTo:(NSTimeInterval)progress
{
    self.elapsedTimeLabel.text = [ControlsViewController formatTime:progress];
    
    NSTimeInterval duration = CMTimeGetSeconds(session.player.currentItem.duration);
    float percent = progress / duration;
    self.progressSlider.value = isnan(percent) ? 0.0f : percent;
}

- (void)playbackConsumer:(id<BCOVPlaybackSessionConsumer>)consumer playbackSession:(id<BCOVPlaybackSession>)session didReceiveLifecycleEvent:(BCOVPlaybackSessionLifecycleEvent *)lifecycleEvent
{
    if ([kBCOVPlaybackSessionLifecycleEventPlay isEqualToString:lifecycleEvent.eventType])
    {
        self.playPauseButton.selected = YES;
    }
    else if([kBCOVPlaybackSessionLifecycleEventPause isEqualToString:lifecycleEvent.eventType])
    {
        self.playPauseButton.selected = NO;
    }
}

#pragma mark IBActions

- (IBAction)playPauseButtonPressed:(UIButton *)sender
{
    if (sender.selected)
    {
        [self.currentPlayer pause];
    }
    else
    {
        [self.currentPlayer play];
    }
}

- (IBAction)sliderValueChanged:(UISlider *)sender
{
    NSTimeInterval newCurrentTime = sender.value * CMTimeGetSeconds(self.currentPlayer.currentItem.duration);
    self.elapsedTimeLabel.text = [ControlsViewController formatTime:newCurrentTime];
}

- (IBAction)sliderTouchBegin:(UISlider *)sender
{
    self.wasPlayingOnSeek = self.playPauseButton.selected;
    [self.currentPlayer pause];
}

- (IBAction)sliderTouchEnd:(UISlider *)sender
{
    NSTimeInterval newCurrentTime = sender.value * CMTimeGetSeconds(self.currentPlayer.currentItem.duration);
    CMTime seekToTime = CMTimeMakeWithSeconds(newCurrentTime, 600);
    
    @weakify(self);
    
    [self.currentPlayer seekToTime:seekToTime completionHandler:^(BOOL finished) {
        
        @strongify(self);
        
        if (finished && self.wasPlayingOnSeek)
        {
            self.wasPlayingOnSeek = NO;
            [self.currentPlayer play];
        }
        
    }];
}

#pragma mark Class Methods

+ (NSString *)formatTime:(NSTimeInterval)timeInterval
{
    if (timeInterval == 0)
    {
        return @"00:00";
    }
    
    NSInteger hours = floor(timeInterval / 60.0f / 60.0f);
    NSInteger minutes = (NSInteger)(timeInterval / 60.0f) % 60;
    NSInteger seconds = (NSInteger)timeInterval % 60;
    
    NSString *ret = nil;
    if (hours > 0)
    {
        ret = [NSString stringWithFormat:@"%ld:%.2ld:%.2ld", (long)hours, (long)minutes, (long)seconds];
    }
    else
    {
        ret = [NSString stringWithFormat:@"%.2ld:%.2ld", (long)minutes, (long)seconds];
    }
    
    return ret;
}

@end
