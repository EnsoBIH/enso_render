RegisterNetEvent('enso_render:StartAction', function(data)
    if GetInvokingResource() == nil then

        SendNUIMessage({
            action = "start",
            data = data
        })

    end
end)

RegisterNUICallback('trigger', function(data, cb)
    TriggerServerEvent(data.trigger, data.url)
end)