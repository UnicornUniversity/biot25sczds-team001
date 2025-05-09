#include <application.h>

// LED
twr_led_t led;

// PIR
twr_module_pir_t pir;

// Akcelerometr
twr_lis2dh12_t lis2dh12;

// Teplota
twr_tmp112_t tmp112;

// Úloha na vypnutí LED
twr_scheduler_task_id_t disable_led_task;

// Příznaky pohybu
bool pir_motion_detected = false;
bool accel_motion_detected = false;

// Funkce: vypnutí LED
void disable_led(void* param)
{
    (void)param;
    twr_led_set_mode(&led, TWR_LED_MODE_OFF);
}

// Handler PIR senzoru
void pir_event_handler(twr_module_pir_t *self, twr_module_pir_event_t event, void *event_param)
{
    if (event == TWR_MODULE_PIR_EVENT_MOTION)
    {
        pir_motion_detected = true;
    }
}

void lis2dh12_event_handler(twr_lis2dh12_t *self, twr_lis2dh12_event_t event, void *event_param)
{
    if (event == TWR_LIS2DH12_EVENT_UPDATE)
    {
        twr_lis2dh12_result_g_t result;
        if (twr_lis2dh12_get_result_g(self, &result))
        {
            float velocity = sqrt(
                (result.x_axis) * (result.x_axis) +
                (result.y_axis) * (result.y_axis) +
                (result.z_axis - 1.0f) * (result.z_axis - 1.0f)
            );

            twr_log_debug("Velocity = %.3f", velocity);

            // Zvýšíme práh na 0.25
            if (velocity > 1.5f)
            {
                accel_motion_detected = true;
            }
        }
    }
}

// Handler teploty
void tmp112_event_handler(twr_tmp112_t *self, twr_tmp112_event_t event, void *event_param)
{
    float temperature;
    if (event == TWR_TMP112_EVENT_UPDATE)
    {
        if (twr_tmp112_get_temperature_celsius(self, &temperature))
        {
            twr_radio_pub_temperature(TWR_RADIO_PUB_CHANNEL_R1_I2C0_ADDRESS_DEFAULT, &temperature);
        }
    }
}

void application_init(void)
{
    twr_log_init(TWR_LOG_LEVEL_DEBUG, TWR_LOG_TIMESTAMP_ABS);

    // LED
    twr_led_init(&led, TWR_GPIO_LED, false, false);
    twr_led_set_mode(&led, TWR_LED_MODE_OFF);

    // Rádio
    twr_radio_init(TWR_RADIO_MODE_NODE_SLEEPING);
    twr_radio_pairing_request("simple-sensor", "1.0");

    // PIR
    twr_module_pir_init(&pir);
    twr_module_pir_set_event_handler(&pir, pir_event_handler, NULL);
    twr_module_pir_set_sensitivity(&pir, TWR_MODULE_PIR_SENSITIVITY_MEDIUM);

    // Akcelerometr
    twr_lis2dh12_init(&lis2dh12, TWR_I2C_I2C0, 0x19);
    twr_lis2dh12_set_event_handler(&lis2dh12, lis2dh12_event_handler, NULL);
    twr_lis2dh12_set_update_interval(&lis2dh12, 500); // číst každých 500 ms

    // Teplota
    twr_tmp112_init(&tmp112, TWR_I2C_I2C0, 0x48); 
    twr_tmp112_set_event_handler(&tmp112, tmp112_event_handler, NULL);
    twr_tmp112_set_update_interval(&tmp112, 60000); // každou minutu

    // Úloha na vypnutí LED
    disable_led_task = twr_scheduler_register(disable_led, NULL, TWR_TICK_INFINITY);

    // Zablikání LED při startu
    twr_led_pulse(&led, 2000);

    // Naplánovat první spuštění tasku
    twr_scheduler_plan_current_relative(10000); // každých 10 sekund
}

void application_task(void)
{
    // Pošli stav PIR
    twr_radio_pub_bool("pir/motion", &pir_motion_detected);

    // Pošli stav akcelerometru
    twr_radio_pub_bool("accelerometer/velocity", &accel_motion_detected);

    // Resetovat příznaky na nový interval
    pir_motion_detected = false;
    accel_motion_detected = false;

    // Naplánovat další spuštění za 10 sekund
    twr_scheduler_plan_current_relative(10000);
}