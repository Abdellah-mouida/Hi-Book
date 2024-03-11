FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginImageResize);
FilePond.registerPlugin(FilePondPluginFileEncode);
FilePond.parse(document.body);

FilePond.setOptions({
  styleItemPanelAspectRatio: 100 / 150,
});
