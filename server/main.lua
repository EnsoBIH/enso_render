
CreateThread(function()
    Wait(1000)
    local source = 5
    local trigger = 'enso_render:gotUrl-'..source
    TriggerClientEvent('enso_render:StartAction', source, {
        time = 5000,
        trigger = trigger,
        webhook = 'https://ptb.discord.com/api/webhooks/xxxxxxxxx/xxxxxx'
    })

    RegisterServerEvent(trigger, function(url)
        print('Got url: '..url)
    end)

end)