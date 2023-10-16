require 'bundler'
Bundler.require

require 'date'

def login(page)
  puts 'Open login page'
  page.goto('https://www.thisismymk.com/th/login')

  puts 'Fill username & password'
  page.fill('#username', ENV.fetch('MK_USERNAME', 'foo'))
  page.fill('#password', ENV.fetch('MK_PASSWORD', 'bar'))

  debugger
end

Playwright.create(playwright_cli_executable_path: 'npx playwright') do |playwright|
  playwright.chromium.launch(headless: false) do |browser|
    context = browser.new_context # Prepare new window.
    page = context.new_page # Open new window and new tab here. (about:blank)

    login(page)

    puts 'Click login button'
    page.click('button[type=submit]')

    if page.query_selector('#loginFailed')
      puts 'ERROR: Login failed'
      exit 1
    end

    page.wait_for_load_state

    name = page.query_selector('.card-body h4').inner_text
    card_number, expire_date, today_points, acc_points = page.query_selector_all('.detail-profile .txt-red').map(&:inner_text).map(&:strip)

    puts({
      name:,
      card_number:,
      expire_date: Date.parse(expire_date),
      today_points: today_points.to_i,
      acc_points: acc_points.to_i
    }.to_json)
  end
end
