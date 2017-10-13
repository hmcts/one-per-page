import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';

$(document).ready(() => {
  const showHideContent = new ShowHideContent();
  showHideContent.init();
});
