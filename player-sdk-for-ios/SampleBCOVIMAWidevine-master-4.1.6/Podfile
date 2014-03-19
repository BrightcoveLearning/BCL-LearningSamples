platform :ios, '6.1'

pod 'Brightcove-Player-SDK', '4.1.6'
pod 'Brightcove-Player-SDK-Widevine', '1.0.5'
pod 'Brightcove-Player-SDK-IMA', '1.0.6'

# Remove 64-bit build architecture from Pods targets
post_install do |installer|
  installer.project.targets.each do |target|
    target.build_configurations.each do |configuration|
      target.build_settings(configuration.name)['ARCHS'] = '$(ARCHS_STANDARD_32_BIT)'
    end
  end
end
